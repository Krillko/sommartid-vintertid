import moment from 'moment'

/**
 * Calculates how many minues of qStart/End is inside tStart/End
 * All strings in are minute:second, either 12:01 or 12:1
 * @param {string|NaN|moment} tStart
 * @param {string|NaN|moment} tEnd
 * @param {string|NaN} qStart
 * @param {string|NaN} qEnd
 * @param {number} offset - adds or subtracts, hours
 * @return {number} - in minutes
 */
export const timeOverlap = (tStart, tEnd, qStart, qEnd, offset = 0) => {
  // The date here doesn't matter, just need to parse
  const targetStart =
    tStart instanceof moment ? tStart : moment('2018-11-11 ' + tStart)
  const targetEnd = tEnd instanceof moment ? tEnd : moment('2018-11-11 ' + tEnd)

  if (tStart instanceof moment) {
    console.log(targetStart)
  }

  const fixdateStart =
    tStart instanceof moment ? tStart.format('YYYY-MM-DD ') : '2018-11-11 '
  const fixdateEnd =
    tEnd instanceof moment ? tEnd.format('YYYY-MM-DD ') : '2018-11-11 '

  // check nan
  if (typeof qStart === 'number') {
    qStart = '0:0'
  }
  if (typeof qEnd === 'number') {
    qEnd = '23:59'
  }

  let queryStart = moment(fixdateStart + qStart)
  let queryEnd = moment(fixdateStart + qEnd)

  /*
  if (tStart instanceof moment) {
    console.group('Test')
    console.log(fixdateStart)
    console.log(targetStart.format('HH:mm'))
    console.log(targetEnd.format('HH:mm'))
    console.log(queryStart.format('HH:mm'))
    console.log(queryEnd.format('HH:mm'))
    console.groupEnd()
  }
  */

  if (offset !== 0) {
    queryStart.add(offset, 'h')
    queryEnd.add(offset, 'h')
    if (queryStart.isBefore('2018-11-11 00:00')) {
      console.log('day before')
      queryStart = moment('2018-11-11 00:00')
    }
    if (queryEnd.isAfter('2018-11-11 23:59')) {
      console.log('day after')
      queryEnd = moment('2018-11-11 23:59')
    }
  }

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

export const getTimeScore = (
  dawn,
  sunrise,
  sunset,
  dusk,
  preferstart,
  preferend,
  offset = 0,
  pointsSun = 1,
  pointsDawnDusk = 0
) => {
  let minSun = timeOverlap(preferstart, preferend, sunrise, sunset, offset)
  let minDawn = timeOverlap(preferstart, preferend, dawn, sunrise, offset)
  let minDusk = timeOverlap(preferstart, preferend, sunset, dusk, offset)

  return {
    minSun: minSun,
    minDawn: minDawn,
    minDusk: minDusk,
    score:
      minSun * pointsSun + minDawn * pointsDawnDusk + minDusk * pointsDawnDusk
  }
}

/**
 * Rounds to a number of decimals
 * @param {number} value
 * @param {int} [precision=0]
 * @return {number}
 */
export const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
