export function getTruncatedFileName(fullFileName: string, maxLength: number): string {
    if (fullFileName.length <= maxLength) {
        return fullFileName; // No need to truncate
    }

    const dotIndex = fullFileName.lastIndexOf('.');
    const extension = fullFileName.substring(dotIndex); // Extract file extension
    const name = fullFileName.substring(0, dotIndex);  // Extract file name without extension

    // Truncate the name and append the extension
    return name.substring(0, maxLength - extension.length - 3) + '...' + extension;
}

// Utility function to extract file name
export function getFileName(url: string): string {
    debugger
    let result = url.substring(url.lastIndexOf('/') + 1);

    return result
}