const entries = {
  parcels: 'parcels',
  parcelsEdit: 'parcelEdit'
}

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

function clear (request) {
  request.yar.clear(entries.parcels)
  request.yar.clear(entries.parcelsEdit)
}

const setParcels = (request, key, value) => {
  set(request, entries.parcels, key, value)
}

const setParcelsEdit = (request, key, value) => {
  set(request, entries.parcelsEdit, key, value)
}

function getParcels (request, key) {
  return get(request, entries.parcels, key)
}

function getParcelsEdit (request, key) {
  return get(request, entries.parcelsEdit, key)
}

module.exports = {
  clear,
  getParcels,
  getParcelsEdit,
  setParcels,
  setParcelsEdit
}
