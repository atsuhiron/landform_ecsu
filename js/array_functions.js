const getRange = n => [...Array(n).keys()];
const getInnerRange = n => getRange(n).filter(x => x > 0 && x < n - 1);
const getSlicedRange = (start, end) => getRange(end).filter(x => x >= start);
const get2dArrayInitialized = (ySize, xSize) => new Array(ySize).fill(0).map(x => new Array(xSize).fill(0));

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

function calcGaussianFilter(sigma, maxSize, trunc = 3) {
    var filterLen = Math.min(maxSize, parseInt(Math.sqrt(trunc * sigma * sigma / 2) * 2 + 1));
    if (filterLen % 2 == 0) {
        filterLen += 1;
    }
    // if (filterLen < 3) {
    //     filterLen = 3;
    // }

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
    // NOTE: It behaves a little differently from scipy.ndimage.convolve().
    //       https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.convolve.html
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

function addArrArr(arr1, arr2) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] + arr2[i][j];
        }
    }
    return ret;
}

function subArrArr(arr1, arr2) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] - arr2[i][j];
        }
    }
    return ret;
}

function mulArrArr(arr1, arr2) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] * arr2[i][j];
        }
    }
    return ret;
}

function addArrScalar(arr1, scalar) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] + scalar;
        }
    }
    return ret;
}

function subArrScalar(arr1, scalar) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] - scalar;
        }
    }
    return ret;
}

function mulArrScalar(arr1, scalar) {
    const originXLen = arr1[0].length;
    const originYLen = arr1.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = arr1[i][j] * scalar;
        }
    }
    return ret;
}

function toNonNegative(arr) {
    const originXLen = arr[0].length;
    const originYLen = arr.length;
    const ret = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            ret[i][j] = Math.max(arr[i][j], 0);
        }
    }
    return ret;
}

function genGaussianFilterSequence(maxSigma, maxSize) {
    const filters = [];
    const range = getSlicedRange(1, maxSigma + 1);
    for (let sigma in range) {
        filters.push(calcGaussianFilter(range[sigma], maxSize));
    }
    return filters;
}

function genNoise2D(ySize, xSize, power, gFilters) {
    // generate proto random array
    const originalNoise = get2dArrayInitialized(ySize, xSize);
    for (let i in getRange(ySize)) {
        for (let j in getRange(xSize)) {
            originalNoise[i][j] = Math.random();
        }
    }

    // define coefficient to multiply each scale by.
    var coefArr = getSlicedRange(1, gFilters.length + 1).map(x => Math.pow(x, power));
    coefArr = mulArrScalar([coefArr], 1 / coefArr.reduce((sum, element) => sum + element, 0))[0];

    var sINoise = get2dArrayInitialized(ySize, xSize);
    for (let s in getRange(gFilters.length)) {
        sINoise = addArrArr(sINoise, conv2D(originalNoise, gFilters[s]));
    }

    return sINoise;
}

function calcGradX(arr) {
    const originXLen = arr[0].length;
    const originYLen = arr.length;

    const gradX = get2dArrayInitialized(originYLen, originXLen);
    const rangeY = getRange(originYLen);
    const rangeX = getInnerRange(originXLen);
    for (let i in rangeY) {
        let yi = rangeY[i];

        // inner
        gradX[yi] = assigneWithoutEdge(
            rangeX.map(xi => (arr[yi][xi + 1] - arr[yi][xi - 1]) * 0.5),
            gradX[yi]
        );

        // left edge
        gradX[yi][0] = arr[yi][1] - arr[yi][0];

        // right edge
        gradX[yi][originXLen - 1] = arr[yi][originXLen - 1] - arr[yi][originXLen - 2];
    }
    return gradX;
}

function calcGradY(arr) {
    const originXLen = arr[0].length;
    const originYLen = arr.length;

    const gradY = get2dArrayInitialized(originYLen, originXLen);
    const rangeY = getInnerRange(originYLen);
    const rangeX = getRange(originXLen);
    for (let i in rangeX) {
        let xi = rangeX[i];

        // inner
        for (let j in rangeY) {
            let yj = rangeY[j];
            gradY[yj][xi] = (arr[yj + 1][xi] - arr[yj - 1][xi]) * 0.5;
        }

        // upper edge
        gradY[0][xi] = arr[1][xi] - arr[0][xi];

        // bottom edge
        gradY[originYLen - 1][xi] = arr[originYLen - 1][xi] - arr[originYLen - 2][xi];
    }
    return gradY;
}

function calcGradNorm(arr) {
    const originXLen = arr[0].length;
    const originYLen = arr.length;

    const gradX = calcGradX(arr);
    const gradY = calcGradY(arr);

    const norm = get2dArrayInitialized(originYLen, originXLen);
    for (let i in getRange(originYLen)) {
        for (let j in getRange(originXLen)) {
            norm[i][j] = Math.sqrt(gradX[i][j] ** 2 + gradY[i][j] ** 2);
        }
    }
    return norm;
}

function calcLaplacian(arr) {
    const gradXGrad = calcGradX(calcGradX(arr));
    const gradYGrad = calcGradY(calcGradY(arr));
    return addArrArr(gradXGrad, gradYGrad);
}

function calcErosion(arr, cInstable, cSteep) {
    const steepArr = mulArrScalar(calcGradNorm(arr), cSteep);
    const instArr = mulArrScalar(calcLaplacian(arr), cInstable);
    return toNonNegative(subArrArr(steepArr, instArr));
}

function calcSediment(arr, cSed) {
    // TODO: redundant calcuration
    const sedArr = mulArrScalar(calcLaplacian(arr), cSed);
    return toNonNegative(sedArr);
}

function step(arr, cInstable, cSteep, cSed, diffFilter) {
    var diff = subArrArr(calcSediment(arr, cSed), calcErosion(arr, cInstable, cSteep));
    diff = conv2D(diff, diffFilter);
    return toNonNegative(addArrArr(arr, diff));
}

function float2DToUint81D(arr2d) {
    const originYLen = arr2d.length;
    var arr1d = [];
    getRange(originYLen).forEach(
        i => arr1d = arr1d.concat(arr2d[i])
    )
    return new Uint8Array(arr1d);
}