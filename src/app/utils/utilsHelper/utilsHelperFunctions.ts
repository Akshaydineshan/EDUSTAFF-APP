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

export function getOrdinalSuffix(num:number) {
    let lastDigit = num % 10;
    let lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return num + "th";
    }

    switch (lastDigit) {
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
        default:
            return num + "th";
    }
}

export function  isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}