import moment from 'moment'

/**
 * Calculates how many minues of qStart/End is inside tStart/End
 * All strings in are minute:second, either 12:01 or 12:1
 * @param {string|NaN} tStart
 * @param {string|NaN} tEnd
 * @param {string|NaN} qStart
 * @param {string|NaN} qEnd
 * @return {number} - in minutes
 */
export const timeOverlap = (tStart, tEnd, qStart, qEnd) => {
  // The date here doesn't matter, just need to parse
  const targetStart = moment('2018-11-11 ' + tStart)
  const targetEnd = moment('2018-11-11 ' + tEnd)

  // check nan
  if (typeof qStart === 'number') {
    qStart = '0:0'
  }
  if (typeof qEnd === 'number') {
    qEnd = '23:55'
  }

  //console.log(targetStart.format('HH:mm'))
  //console.log(targetEnd.format('HH:mm'))

  let queryStart = moment('2018-11-11 ' + qStart)
  let queryEnd = moment('2018-11-11 ' + qEnd)

  //console.log(queryStart.format('HH:mm'))
  //console.log(queryEnd.format('HH:mm'))

  if (
    queryStart.isSameOrAfter(targetEnd) ||
    queryEnd.isSameOrBefore(targetStart)
  ) {
    //console.log('out of range')
    return 0
  }

  if (queryStart.isBefore(targetStart)) {
    //console.log('before')
    queryStart = targetStart.clone()
  }
  if (queryEnd.isAfter(targetEnd)) {
    //console.log('after')
    queryEnd = targetEnd.clone()
  }

  return queryEnd.diff(queryStart, 'm')
}
