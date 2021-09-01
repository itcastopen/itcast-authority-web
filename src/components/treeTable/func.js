
const func = {
  clearHoverStatus() {
    let rows = document.querySelectorAll('.tree-row')
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const hoverBlock = row.children[row.children.length - 1]
      hoverBlock.style.display = 'none'
      hoverBlock.children[0].style.opacity = 0.1
      hoverBlock.children[1].style.opacity = 0.1
      hoverBlock.children[2].style.opacity = 0.1
    }
  },
  getElementTop(element, tableRef) {
    // 固定表头，需要做特殊计算
    let scrollTop = tableRef.querySelector('.drag-tree-table-body').scrollTop
    let actualTop = element.offsetTop - scrollTop
    let current = element.offsetParent
    while (current !== null) {
      actualTop += current.offsetTop
      current = current.offsetParent
    }
    return actualTop
  },
  getElementLeft(element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent
    while (current !== null) {
      actualLeft += current.offsetLeft
      current = current.offsetParent
    }
    return actualLeft
  },
  deepClone(aObject) {
    if (!aObject) {
      return aObject
    }
    let bObject, v, k
    bObject = Array.isArray(aObject) ? [] : {}
    for (k in aObject) {
      v = aObject[k]
      bObject[k] = (typeof v === 'object') ? func.deepClone(v) : v
    }
    return bObject
  }
}
export default func
