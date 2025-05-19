<?php
// Set headers to prevent caching issues
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');

// Define constants for file paths
define('FOOTER_FILE', 'data/footer.json');
define('LOGO_FILE', 'data/logo.json');
define('LINKS_FILE', 'data/links.json');
define('ARTICLES_FILE', 'data/articles.json');
define('UPLOADS_DIR', 'uploads/');

// Create data directory if it doesn't exist
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Create uploads directory if it doesn't exist
if (!file_exists(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}

/**
 * Save data to a JSON file
 * 
 * @param string $file The filename to save to
 * @param array $data The data to save
 * @return bool Success status
 */
function saveJsonData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

/**
 * Load data from a JSON file
 * 
 * @param string $file The filename to load from
 * @param array $default Default value if file doesn't exist
 * @return array The loaded data
 */
function loadJsonData($file, $default = []) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        return json_decode($content, true) ?: $default;
    }
    return $default;
}

/**
 * Save an uploaded image and return its path
 * 
 * @param array $file The $_FILES array element
 * @param string $prefix Optional prefix for the filename
 * @return string|false Path to saved image or false on failure
 */
function saveUploadedImage($file, $prefix = '') {
    // Check if file was uploaded properly
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return false;
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $prefix . '_' . uniqid() . '.' . $extension;
    $filepath = UPLOADS_DIR . $filename;
    
    // Move uploaded file to destination
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return $filepath;
    }
    
    return false;
}

/**
 * Save base64 image and return its path
 * 
 * @param string $base64Data Base64 encoded image data
 * @param string $prefix Optional prefix for the filename
 * @return string|false Path to saved image or false on failure
 */
function saveBase64Image($base64Data, $prefix = '') {
    // Extract image data from base64 string
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $matches)) {
        $imageType = $matches[1];
        $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
        $imageData = base64_decode($base64Data);
        
        if ($imageData === false) {
            return false;
        }
        
        // Generate unique filename
        $filename = $prefix . '_' . uniqid() . '.' . $imageType;
        $filepath = UPLOADS_DIR . $filename;
        
        // Save file
        if (file_put_contents($filepath, $imageData)) {
            return $filepath;
        }
    }
    
    return false;
}