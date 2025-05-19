<?php
// Include common utility functions
require_once 'utils.php';

// Handle different API requests based on the action parameter
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'save_footer':
        handleSaveFooter();
        break;
        
    case 'load_footer':
        handleLoadFooter();
        break;
        
    case 'save_logo':
        handleSaveLogo();
        break;
        
    case 'load_logo':
        handleLoadLogo();
        break;
        
    case 'save_links':
        handleSaveLinks();
        break;
        
    case 'load_links':
        handleLoadLinks();
        break;
        
    case 'save_articles':
        handleSaveArticles();
        break;
        
    case 'load_articles':
        handleLoadArticles();
        break;
        
    case 'upload_image':
        handleImageUpload();
        break;
        
    default:
        // Return error for invalid action
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

/**
 * Handle saving footer data
 */
function handleSaveFooter() {
    // Get POST data as JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }
    
    // Validate required fields
    if (!isset($data['companyName']) || !isset($data['companyDesc']) || !isset($data['companyCopyright'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    // Save to JSON file
    if (saveJsonData(FOOTER_FILE, $data)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data']);
    }
}

/**
 * Handle loading footer data
 */
function handleLoadFooter() {
    $defaultFooter = [
        'companyName' => 'Your company\'s name',
        'companyDesc' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'companyCopyright' => '© 2024, Company\'s name. All rights reserved.'
    ];
    
    $data = loadJsonData(FOOTER_FILE, $defaultFooter);
    echo json_encode($data);
}

/**
 * Handle saving logo data
 */
function handleSaveLogo() {
    // Check if it's a file upload or base64 data
    if (isset($_FILES['logoFile']) && $_FILES['logoFile']['error'] === UPLOAD_ERR_OK) {
        // Handle file upload
        $filepath = saveUploadedImage($_FILES['logoFile'], 'logo');
        
        if ($filepath) {
            $data = ['type' => 'image', 'path' => $filepath];
            if (saveJsonData(LOGO_FILE, $data)) {
                echo json_encode(['success' => true, 'logo' => $data]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save logo data']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save logo image']);
        }
    } else {
        // Handle text or base64 image data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['logo'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid logo data']);
            return;
        }
        
        $logoData = $data['logo'];
        
        // Check if it's base64 image data
        if (strpos($logoData, 'data:image') === 0) {
            $filepath = saveBase64Image($logoData, 'logo');
            
            if ($filepath) {
                $logoData = ['type' => 'image', 'path' => $filepath];
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save logo image']);
                return;
            }
        } else {
            // It's just text
            $logoData = ['type' => 'text', 'text' => $logoData];
        }
        
        if (saveJsonData(LOGO_FILE, $logoData)) {
            echo json_encode(['success' => true, 'logo' => $logoData]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save logo data']);
        }
    }
}

/**
 * Handle loading logo data
 */
function handleLoadLogo() {
    $defaultLogo = ['type' => 'text', 'text' => 'LOGO'];
    
    $data = loadJsonData(LOGO_FILE, $defaultLogo);
    echo json_encode($data);
}

/**
 * Handle saving links data
 */
function handleSaveLinks() {
    // Get POST data as JSON
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['links']) || !is_array($data['links'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid links data']);
        return;
    }
    
    // Save to JSON file
    if (saveJsonData(LINKS_FILE, $data['links'])) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save links']);
    }
}

/**
 * Handle loading links data
 */
function handleLoadLinks() {
    $data = loadJsonData(LINKS_FILE, []);
    echo json_encode(['links' => $data]);
}

/**
 * Handle saving articles data
 */
function handleSaveArticles() {
    $newData = json_decode(file_get_contents('php://input'), true);

    if (!$newData || !isset($newData['articles']) || !is_array($newData['articles'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid articles data']);
        return;
    }

    $newArticles = $newData['articles'];

    // Lataa vanhat artikkelit
    $oldArticles = loadJsonData(ARTICLES_FILE, []);

    // Kerää vanhat kuvatiedostot
    $oldImages = array_filter(array_column($oldArticles, 'image'));

    // Käsittele uudet artikkelit, tallenna base64-kuvatiedot
    foreach ($newArticles as &$article) {
        if (isset($article['image']) && strpos($article['image'], 'data:image') === 0) {
            $filepath = saveBase64Image($article['image'], 'article');

            if ($filepath) {
                $article['image'] = $filepath;
            }
        }
    }

    // Kerää uudet kuvatiedostot (jotka ovat polkuja, ei base64)
    $newImages = array_filter(array_column($newArticles, 'image'));

    // Selvitä poistettavat kuvat
    $imagesToDelete = array_diff($oldImages, $newImages);

    foreach ($imagesToDelete as $img) {
        if (file_exists($img)) {
            unlink($img); // Poista kuva levyltä
        }
    }

    // Tallenna uudet artikkelit
    if (saveJsonData(ARTICLES_FILE, $newArticles)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save articles']);
    }
}


/**
 * Handle loading articles data
 */
function handleLoadArticles() {
    $data = loadJsonData(ARTICLES_FILE, []);
    echo json_encode(['articles' => $data]);
}

/**
 * Handle image upload
 */
function handleImageUpload() {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No image uploaded']);
        return;
    }
    
    $filepath = saveUploadedImage($_FILES['image']);
    
    if ($filepath) {
        echo json_encode(['success' => true, 'path' => $filepath]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save image']);
    }
}