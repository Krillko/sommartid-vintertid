import moment from 'moment'

/**
 * Calculates how many minues of qStart/End is inside preferStart/End
 * All strings in are minute:second, either 12:01 or 12:1
 * @param {moment} baseDate
 * @param {moment} preferStart
 * @param {moment} preferEnd
 * @param {moment} qStart
 * @param {moment} qEnd
 * @param {number} offset - adds or subtracts, hours
 * @return {number} - in minutes
 */
export const timeOverlap = (
  baseDate,
  preferStart,
  preferEnd,
  qStart,
  qEnd,
  offset = 0
) => {
  console.group(baseDate.format('D MMM'))
  console.log('offset: ' + offset)
  console.log('preferStart: ' + preferStart.format('MM-DD HH:mm'))
  console.log('preferEnd: ' + preferEnd.format('MM-DD HH:mm'))
  console.log('qStart: ' + qStart.format('MM-DD HH:mm'))
  console.log('qEnd: ' + qEnd.format('MM-DD HH:mm'))

  /**
   * There is no way in suncalc today to know if there is midnight sun
   * or permantent darkness, so we simply decides that some months are
   * summer, and the rest not.
   * Note 1: month begins on 0
   * Note 2: Months with midnight sun are based on Svalbard
   * north of sweden. If this ever going outside scandinavia, this
   * quickfix should be replaced
   * @type {boolean}
   */
  const summer = [3, 4, 5, 6, 7].includes(baseDate.month())

  /**
   * We need to clone it, since it will change
   * parent otherwise
   */
  let queryStart = qStart.clone()
  let queryEnd = qEnd.clone()

  /**
   * @todo Perhaps this needs to change to start of next day
   */
  if (offset !== 0) {
    console.log('qStart before offset: ' + queryStart.format('MM-DD HH:mm'))
    console.log('qEnd before offset: ' + queryEnd.format('MM-DD HH:mm'))
    queryStart.add(offset, 'h')
    queryEnd.add(offset, 'h')
    console.log('qStart after offset: ' + queryStart.format('MM-DD HH:mm'))
    console.log('qEnd after offset: ' + queryEnd.format('MM-DD HH:mm'))
  }

  if (!queryStart.isValid()) {
    if (summer) {
      queryStart = preferStart.clone()
    }
  }

  if (!queryEnd.isValid()) {
    if (summer) {
      queryEnd = preferEnd.clone()
    }
  }

  if (
    queryStart.isSameOrAfter(preferEnd) ||
    queryEnd.isSameOrBefore(preferStart)
  ) {
    console.log('out of range')
    console.groupEnd()
    return 0
  }

  if (queryStart.isBefore(preferStart)) {
    console.log('before')
    queryStart = preferStart.clone()
  }
  if (queryEnd.isAfter(preferEnd)) {
    console.log('after')
    queryEnd = preferEnd.clone()
  }

  console.log('preferStart: ' + preferStart.format('MM-DD HH:mm'))
  console.log('preferEnd: ' + preferEnd.format('MM-DD HH:mm'))
  console.log('qStart fixed: ' + queryStart.format('MM-DD HH:mm'))
  console.log('qEnd fixed: ' + queryEnd.format('MM-DD HH:mm'))

  const result = queryEnd.diff(queryStart, 'm')
  console.log('Result(min):' + result)
  console.groupEnd()

  return result > 0 ? result : 0
}
/**
 * @param {moment} baseDate
 * @param {moment} dawn
 * @param {moment} sunrise
 * @param {moment} sunset
 * @param {moment} dusk
 * @param {moment} preferstart
 * @param {moment} preferend
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
  let minSun = 0,
    minDawn = 0,
    minDusk = 0
  /**
   * There is no way in suncalc today to know if there is midnight sun
   * or permantent darkness, so we simply decides that some months are
   * summer, and the rest not.
   * Note 1: month begins on 0
   * Note 2: Months with midnight sun are based on Svalbard
   * north of sweden. If this ever going outside scandinavia, this
   * quickfix should be replaced
   * @type {boolean}
   */
  const summer = [3, 4, 5, 6, 7].includes(baseDate.month())
  minSun = timeOverlap(
    baseDate,
    preferstart,
    preferend,
    sunrise,
    sunset,
    offset
  )

  if (summer && !sunrise.isValid() && !sunset.isValid()) {
    console.log('midnattsol')
  } else if (!sunrise.isValid()) {
    console.log('polarnatt')

    minDawn = timeOverlap(baseDate, preferstart, preferend, dawn, dusk, offset)
  } else {
    //console.warn('min dawn')
    minDawn = timeOverlap(
      baseDate,
      preferstart,
      preferend,
      dawn,
      sunrise,
      offset
    )
    //console.warn('min dusk')
    minDusk = timeOverlap(
      baseDate,
      preferstart,
      preferend,
      sunset,
      dusk,
      offset
    )
  }

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
