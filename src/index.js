module.exports = (opts) => {
    opts = opts || {}
    opts.words = opts.words || {}
    opts.tokenize = opts.tokenize || (el => el.replace(/\W/g, ''))
    opts.lang = opts.lang || 'en'

    var _ = require('lodash-fp')

    const classifyEn = (str) => {
        var dict = _.merge(opts.words, require('./../AFINN-111.json'))
        var negate = new RegExp(/^(not|don't|dont|no|nope)$/)

        return str.toLowerCase()
            .split(' ')
            .map(opts.tokenize)
            .reduce((acc, word) => {
                var score = negate.test(acc.prev) ? -dict[word] : dict[word]
                return {
                    sum: acc.sum + (score || 0),
                    prev: word
                }
            }, {sum: 0, prev: ''})
            .sum
    }

    const classifyDe = (str) => {
        var dict = _.merge(opts.words, require('./../german.json'))
        var negate = new RegExp(/^(nein|keine)$/)

        return str.toLowerCase()
            .split(' ')
            .map(opts.tokenize)
            .reduce((acc, word) => {
                var score = negate.test(acc.prev) ? -dict[word] : dict[word]
                return {
                    sum: acc.sum + (score || 0),
                    prev: word
                }
            }, {sum: 0, prev: ''})
            .sum
    }

    if ('en' === opts.lang) {
        return {classify: classifyEn}
    } else {
        return {classify: classifyDe}
    }
}