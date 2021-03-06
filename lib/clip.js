function clip (options) {
  'use strong'

  const book = require('book-length')
  const co = require('co')
  const prompt = require('co-prompt')
  const path = require('path')
  const chalk = require('chalk')

  let leafs = options.leafs

  co(function * () {
    if (options !== undefined && options.leafs % 1 === 0) {
      leafs = options.leafs
    } else {
      leafs = yield prompt('No. of leafs?: ')
    }
    return leafs
  }).then((leafs) => {
    const bookLength = book.length()
    const fse = require('fs-extra')
    const dateFormat = require('dateformat')
    const now = new Date()
    const timestamp = dateFormat(now, 'dddd-mmmm-dS-yyyy-hh-MM-ss-TT')

    process.stdout.write(chalk.yellow(` Clipping [ ${chalk.magenta(leafs)} ] leaf(s) from the end… : `))

    let promises = []

    for (let pageIndex = bookLength, endIndex = bookLength - (parseInt(leafs) * 2); pageIndex > endIndex; pageIndex--) {
      promises.push(
        fse.move(path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), path.join('__dirname', '..', 'trash', `page-${pageIndex}-${timestamp}`))
      )
    }
    return Promise.all(promises)
  }).then((resolutions) => {
    process.stdout.write(chalk.blue('done.') + '\n')
  }).catch((err) => {
    if (err) { return console.log(chalk.red('Clip execution failed', err)) }
  })
}

module.exports.clip = clip
