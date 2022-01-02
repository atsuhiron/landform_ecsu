const getRange = n => [...Array(n).keys()];
const getInnerRange = n => getRange(n).filter(x => x > 0 && x < n - 1);
const getSlicedRange = (start, end) => getRange(end).filter(x => x >= start);

function assigneWithoutEdge(arrShort, arrLong) {
    getInnerRange(arrLong.length).forEach(
        index => arrLong[index] = arrShort[index - 1]
    )
    return arrLong;
}

function expandArrReflect1D(arr, addNum) {
    const length = arr.length + addNum * 2;
    const fullArr = new Array(length);
    for (let index in getRange(length)) {
        if (index <= addNum) {
            // former edge
            fullArr[index] = arr[addNum - index];
            continue;
        }
        if (index >= length - addNum) {
            // later edge
            fullArr[index] = arr[addNum + 2 * arr.length - index - 2];
            continue;
        }
        // inner
        fullArr[index] = arr[index - addNum];
    }
    return fullArr;
}

function conv1D(arr, filtArr) {
    // The length of `filtArr` must be odd.
    const expanded = expandArrReflect1D(arr, parseInt((filtArr.length - 1) / 2));
    const convolved = new Array(arr.length);
    for (let i in getRange(arr.length)) {
        convolved[i] = filtArr.reduce(
            (prev, curr, fIndex) => prev + curr * expanded[parseInt(fIndex) + parseInt(i)],
            0
        )
    }
    return convolved;
}

const get2dArrayInitialized = (ySize, xSize) => new Array(ySize).fill(0).map(x => new Array(xSize).fill(0));

function getGaussianFilter(sigma, maxSize, trunc = 3) {
    var filterLen = Math.min(maxSize, parseInt(Math.sqrt(trunc * sigma * sigma / 2) * 2 + 1));
    if (filterLen % 2 == 0) {
        filterLen += 1;
    }

    const centerIndex = parseInt(filterLen / 2);
    const invSigmaSq = 0.5 / sigma / sigma;
    const coef = 0.5 / Math.PI / sigma;
    const filt = get2dArrayInitialized(filterLen, filterLen);
    for (let i in getRange(filterLen)) {
        for (let j in getRange(filterLen)) {
            const distSq = (centerIndex - i) ** 2 + (centerIndex - j) ** 2;
            filt[j][i] = coef * Math.exp(-distSq * invSigmaSq);
        }
    }
    return filt;
}

function expandArrReflect2D(arr, addNum) {
    const originXLen = arr[0].length;
    const originYLen = arr.length;
    const lengthX = originXLen + addNum * 2;
    const lengthY = originYLen + addNum * 2;

    const fullArr = new Array(lengthY);
    for (let index in getRange(lengthY)) {
        if (index <= addNum) {
            // former edge
            fullArr[index] = expandArrReflect1D(arr[addNum - index], addNum);
            continue;
        }
        if (index >= lengthY - addNum) {
            // later edge
            console.log(addNum + 2 * lengthY - index - 2);
            fullArr[index] = expandArrReflect1D(arr[addNum + 2 * originYLen - index - 2], addNum);
            continue;
        }
        // inner
        fullArr[index] = expandArrReflect1D(arr[index - addNum], addNum);
    }
    return fullArr;
}

function conv2D(arr, filtArr) {
    // The shape of `filtArr` must be square.
    // The edge length of the square must be odd.
    const originXLen = arr[0].length;
    const originYLen = arr.length;

    const expanded = expandArrReflect2D(arr, parseInt((filtArr.length - 1) / 2));
    const convolved = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            convolved[i][j] = filtArr.reduce(
                (prevY, currY, fIndexY) => prevY + currY.reduce(
                    (prevX, currX, fIndexX) => prevX + currX * expanded[parseInt(fIndexY) + parseInt(i)][parseInt(fIndexX) + parseInt(j)],
                    0
                ),
                0
            )
        }
    }
    return convolved;
}

var arr3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
console.log(conv2D(arr3, [[1, 10, 1], [10, 100, 10], [1, 10, 1]]));