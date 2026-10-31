(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    Object.assign(root, api);
})(globalThis, function () {
    function calculateGeometricMean(data) {
        if (!Array.isArray(data) || data.length === 0 || data.some(value => !Number.isFinite(value) || value <= -100)) return NaN;
        const meanLogReturn = data.reduce((sum, value) => sum + Math.log1p(value / 100), 0) / data.length;
        return Math.expm1(meanLogReturn) * 100;
    }

    // Sample downside deviation: all observations remain in the n - 1 denominator.
    function calculateDownsideDeviation(data, target = 0) {
        if (!Array.isArray(data) || data.length < 2 || !Number.isFinite(target) || data.some(value => !Number.isFinite(value))) return NaN;
        const sumSquaredShortfalls = data.reduce((sum, value) => sum + Math.pow(Math.min(value - target, 0), 2), 0);
        return Math.sqrt(sumSquaredShortfalls / (data.length - 1));
    }

    function calculateMaxDrawdown(returnsPerc) {
        if (!Array.isArray(returnsPerc) || returnsPerc.length === 0 || returnsPerc.some(value => !Number.isFinite(value) || value < -100)) {
            return { maxDrawdown: NaN, duration: NaN, peakIndex: -1, troughIndex: -1 };
        }

        let wealth = 1;
        let peakWealth = 1;
        let peakIndex = 0;
        let worstPeakIndex = 0;
        let worstTroughIndex = 0;
        let maxDrawdown = 0;

        returnsPerc.forEach((returnPerc, index) => {
            wealth *= 1 + returnPerc / 100;
            if (wealth >= peakWealth) {
                peakWealth = wealth;
                peakIndex = index + 1;
                return;
            }
            const drawdown = peakWealth === 0 ? 0 : (wealth / peakWealth - 1) * 100;
            if (drawdown < maxDrawdown) {
                maxDrawdown = drawdown;
                worstPeakIndex = peakIndex;
                worstTroughIndex = index + 1;
            }
        });

        return {
            maxDrawdown,
            duration: worstTroughIndex - worstPeakIndex,
            peakIndex: worstPeakIndex,
            troughIndex: worstTroughIndex
        };
    }

    return { calculateGeometricMean, calculateDownsideDeviation, calculateMaxDrawdown };
});
