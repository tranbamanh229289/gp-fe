export function generateQRCodeSVG(text: number): string {
    const size = 256;
    const qrSize = 29;
    const moduleSize = size / qrSize;

    const hash = (str: string, seed = 0) => {
        let h1 = 0xdeadbeef ^ seed;
        for (let i = 0; i < str.length; i++) {
            h1 = Math.imul(h1 ^ str.charCodeAt(i), 2654435761);
        }
        return (h1 ^ (h1 >>> 16)) >>> 0;
    };

    let svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
        size +
        " " +
        size +
        '">';
    svg += '<rect width="' + size + '" height="' + size + '" fill="white"/>';

    for (let y = 0; y < qrSize; y++) {
        for (let x = 0; x < qrSize; x++) {
            const seed = hash(text.toString() + x + y);
            if (seed % 2 === 0) {
                svg +=
                    '<rect x="' +
                    x * moduleSize +
                    '" y="' +
                    y * moduleSize +
                    '" width="' +
                    moduleSize +
                    '" height="' +
                    moduleSize +
                    '" fill="black"/>';
            }
        }
    }

    const addFinderPattern = (x: number, y: number) => {
        const outerSize = moduleSize * 7;
        const innerSize = moduleSize * 3;
        const offset = moduleSize * 2;
        svg +=
            '<rect x="' +
            x * moduleSize +
            '" y="' +
            y * moduleSize +
            '" width="' +
            outerSize +
            '" height="' +
            outerSize +
            '" fill="black"/>';
        svg +=
            '<rect x="' +
            (x * moduleSize + moduleSize) +
            '" y="' +
            (y * moduleSize + moduleSize) +
            '" width="' +
            (outerSize - 2 * moduleSize) +
            '" height="' +
            (outerSize - 2 * moduleSize) +
            '" fill="white"/>';
        svg +=
            '<rect x="' +
            (x * moduleSize + offset) +
            '" y="' +
            (y * moduleSize + offset) +
            '" width="' +
            innerSize +
            '" height="' +
            innerSize +
            '" fill="black"/>';
    };

    addFinderPattern(0, 0);
    addFinderPattern(qrSize - 7, 0);
    addFinderPattern(0, qrSize - 7);

    svg += "</svg>";
    return svg;
}
