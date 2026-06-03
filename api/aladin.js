export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
    if (req.method === 'OPTIONS') return res.status(200).end()
  
    const API_KEY = process.env.ALADIN_API_KEY
    if (!API_KEY) return res.status(500).json({ error: 'API 키 없음' })
  
    const { action = 'search', query = '', searchType = 'Keyword', maxResults = 10, isbn = '' } = req.query
  
    let aladinUrl = ''
  
    if (action === 'search') {
      aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${API_KEY}&Query=${encodeURIComponent(query)}&QueryType=${searchType}&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`
    } else if (action === 'lookup') {
      aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${API_KEY}&itemIdType=ISBN13&ItemId=${isbn}&output=js&Version=20131101&Cover=Big`
    } else if (action === 'bestseller') {
      aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${API_KEY}&QueryType=Bestseller&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`
    } else {
      return res.status(400).json({ error: '잘못된 action' })
    }
  
    try {
      const response = await fetch(aladinUrl)
      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: '알라딘 API 호출 실패' })
    }
  }