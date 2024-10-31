export function decodeAudio(audioData) {
    const binaryString = atob(audioData)

    // Create an array of bytes
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    // Create a Blob object
    const blob = new Blob([bytes], { type: 'audio/mp3' })

    // Create a URL for the Blob
    return URL.createObjectURL(blob)
}