export const getOrderTypeText = (type: string) => {
  return {
    STORE: '온라인몰',
    MALL: '오프라인',
    BPO: 'BPO',
  }[type]
}

export const getSellTypeText = (type: string) => {
  return {
    SELL: '판매',
    RETURN: '반품',
  }[type]
}

export const getReleaseTypeText = (type: string) => {
  return {
    STORE: '매장출고',
    HEAD_OFFICE: '본사출고',
  }[type]
}

export const getAdditionalOrderTypeText = (type: string) => {
  return {
    NORMAL: '일반주문',
    STORE: '매장발주',
  }[type]
}
