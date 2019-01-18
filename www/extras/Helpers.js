import moment from 'moment'

/**
 * Calculates how many minues of qStart/End is inside preferstart/End
 * All strings in are minute:second, either 12:01 or 12:1
 * @param {moment} baseDate
 * @param {string|moment} preferstart
 * @param {string|moment} preferend
 * @param {moment} qStart
 * @param {moment} qEnd
 * @param {number} offset - adds or subtracts, hours
 * @return {number} - in minutes
 */
export const timeOverlap = (
  baseDate,
  preferstart,
  preferend,
  qStart,
  qEnd,
  offset = 0
) => {
  /*
  if (preferstart instanceof moment) {
    console.group('Test')
    console.log(fixdateStart)
    console.log(targetStart.format('HH:mm'))
    console.log(targetEnd.format('HH:mm'))
    console.log(queryStart.format('HH:mm'))
    console.log(queryEnd.format('HH:mm'))
    console.groupEnd()
  }
  */
  console.group(baseDate.format('D MMM'))
  console.log(preferstart)
  console.log(preferend)
  console.groupEnd()

  /*
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
  */

  /*
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
  */
  return 0
}
/**
 * @param {moment} baseDate
 * @param {moment} dawn
 * @param {moment} sunrise
 * @param {moment} sunset
 * @param {moment} dusk
 * @param {string} preferstart
 * @param {string} preferend
 * @param {int} offset
 * @param {int} pointsSun
 * @param {int} pointsDawnDusk
 * @return {{minSun: number, score: number, minDawn: number, minDusk: number}}
 */
export const getTimeScore = (
  baseDate,
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
  let minSun = timeOverlap(
    baseDate,
    preferstart,
    preferend,
    sunrise,
    sunset,
    offset
  )
  let minDawn = timeOverlap(
    baseDate,
    preferstart,
    preferend,
    dawn,
    sunrise,
    offset
  )
  let minDusk = timeOverlap(
    baseDate,
    preferstart,
    preferend,
    sunset,
    dusk,
    offset
  )

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
