import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

export const RSS_SOURCES = [
  { name: 'VnExpress', url: 'https://vnexpress.net/rss/tin-moi-nhat.rss' },
  { name: 'VnExpress - Khoa học', url: 'https://vnexpress.net/rss/khoa-hoc.rss' },
  { name: 'VnExpress - Sức khỏe', url: 'https://vnexpress.net/rss/suc-khoe.rss' },
  { name: 'VnExpress - Gia đình', url: 'https://vnexpress.net/rss/gia-dinh.rss' },
  { name: 'VnExpress - Du lịch', url: 'https://vnexpress.net/rss/du-lich.rss' },
  { name: 'VnExpress - Giải trí', url: 'https://vnexpress.net/rss/giai-tri.rss' },
  { name: 'VnExpress - Giáo dục', url: 'https://vnexpress.net/rss/giao-duc.rss' },
  { name: 'VnExpress - Pháp luật', url: 'https://vnexpress.net/rss/phap-luat.rss' },
  { name: 'VnExpress - Bất động sản', url: 'https://vnexpress.net/rss/bat-dong-san.rss' },
  { name: 'VnExpress - Môi trường', url: 'https://vnexpress.net/rss/moi-truong.rss' },

  { name: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss' },
  { name: 'Tuổi Trẻ - Thể thao', url: 'https://tuoitre.vn/rss/the-thao.rss' },
  { name: 'Tuổi Trẻ - Văn hóa Giải trí', url: 'https://tuoitre.vn/rss/van-hoa-giai-tri.rss' },

  { name: 'Thanh Niên', url: 'https://thanhnien.vn/rss/home.rss' },
  { name: 'Thanh Niên - Thể thao', url: 'https://thanhnien.vn/rss/the-thao.rss' },
  { name: 'Thanh Niên - Giải trí', url: 'https://thanhnien.vn/rss/giai-tri.rss' },

  { name: 'Dân Trí', url: 'https://dantri.com.vn/rss/home.rss' },
  { name: 'Dân Trí - Sức khỏe', url: 'https://dantri.com.vn/rss/suc-khoe.rss' },
  { name: 'Dân Trí - Giáo dục', url: 'https://dantri.com.vn/rss/giao-duc.rss' },
  { name: 'Dân Trí - Văn hóa', url: 'https://dantri.com.vn/rss/van-hoa.rss' },

  { name: 'Vietnamnet - Đời sống', url: 'https://infonet.vietnamnet.vn/rss/doi-song.rss' },
  { name: 'Vietnamnet - Thị trường', url: 'https://infonet.vietnamnet.vn/rss/thi-truong.rss' },
  { name: 'Vietnamnet - Giải trí', url: 'https://vietnamnet.vn/rss/giai-tri.rss' },

  { name: 'Báo Pháp Luật (PLO)', url: 'https://plo.vn/rss/home.rss' },

  { name: 'Kiến Thức', url: 'https://kienthuc.net.vn/rss/home.rss' },

  { name: 'Đất Việt', url: 'https://datviet.com/feed' },

  { name: 'Việt Báo', url: 'https://vietbao.vn/rss/trang-chu' },

  { name: 'Kenh14', url: 'https://m.kenh14.vn/index.rss' },

  { name: 'Báo Người Lao Động', url: 'https://nld.com.vn/rss/home.rss' },
  { name: 'Báo Người Lao Động - Du lịch', url: 'https://nld.com.vn/rss/du-lich.rss' },

  // --- Nguồn RSS liên quan đến Chứng khoán ---
  { name: 'CafeF - Toàn bộ Tin tức', url: 'https://cafef.vn' },
  { name: 'VnEconomy - Tin tổng hợp', url: 'https://vneconomy.vn' },
  {
    name: 'Vietstock - Tin nhanh Chứng khoán',
    url: 'https://vietstock.vn/rss/tin-nhanh-chung-khoan.rss',
  },
  {
    name: 'VietnamBiz - Thị trường Chứng khoán',
    url: 'https://vietnambiz.vn/rss/thi-truong-chung-khoan.rss',
  },

  // --- Nguồn RSS Công nghệ ---
  { name: 'GenK - Tin tổng hợp', url: 'https://genk.vn' },
  { name: 'Tinh Tế - Tin tức', url: 'https://tinhte.vn/feed' },

  // --- Nguồn RSS Thể thao chuyên biệt ---
  { name: 'Bongdaplus', url: 'https://bongdaplus.vn/rss/tin-moi-nhat.rss' },

  // --- Nguồn RSS Sức khỏe chuyên biệt ---
  {
    name: 'Sức khỏe & Đời sống',
    url: 'https://suckhoedoisong.vn/rss/tin-moi-nhat.rss',
  },

  // --- Nguồn RSS Bất động sản chuyên biệt ---
  // { name: 'CafeLand - Tin tức Bất động sản', url: 'https://cafeland.vn/rss/tin-tuc.rss' },
]

export const EN_RSS_SOURCES = [
  // General News
  { name: 'BBC News - Top Stories', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
  // Reuters - Top News: Thường yêu cầu quyền truy cập trả phí hoặc API. Không tìm thấy feed công khai.
  {
    name: 'The New York Times - Top Stories',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  },
  // Associated Press (AP) - Top News: Link cũ không hoạt động. AP thường cung cấp feed cho đối tác trả phí.
  // The Guardian - Top Stories: Yêu cầu API Key hoặc có thể tìm feed chuyên mục cụ thể hơn trên trang.

  // Economy & Stock Market
  // Bloomberg - Top Financial News: Link cũ 403 Forbidden. Bloomberg thường giới hạn RSS công khai.
  { name: 'Financial Times - Top News', url: 'https://www.ft.com/rss/home' },
  // Wall Street Journal (WSJ) - Top News: Link cũ 403 Forbidden. WSJ thường yêu cầu trả phí để truy cập RSS.
  // Reuters - Business News: Tương tự Reuters Top News, thường yêu cầu trả phí.
  { name: 'CNBC - Top News', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },

  // Technology
  { name: 'TechCrunch - Top Stories', url: 'https://techcrunch.com/feed/' },
  { name: 'The Verge - All Articles', url: 'https://www.theverge.com/rss/index.xml' },
  // Ars Technica - All Stories: Link cũ 404 Not Found. Ars Technica không có feed tổng hợp công khai.
  { name: 'Gizmodo - All Posts', url: 'https://gizmodo.com/rss' },
  { name: 'Wired - Latest Stories', url: 'https://www.wired.com/feed/rss' },

  // Health
  // Healthline - News: Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.
  // WebMD - News & Features: Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.
  // NIH - Latest News: Link cũ 404 Not Found. Trang NIH không cung cấp feed RSS công khai.
  // Mayo Clinic - Health News: Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.

  // Science
  {
    name: 'ScienceDaily - Top Science News',
    url: 'https://www.sciencedaily.com/rss/top/science.xml',
  },
  { name: 'Phys.org - Latest Science News', url: 'https://phys.org/rss-feed/' },
  { name: 'NASA - Latest News', url: 'https://www.nasa.gov/news/feed/' },
  // Scientific American - Latest Stories: Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.

  // Sports
  { name: 'ESPN - Top Headlines', url: 'https://www.espn.com/espn/rss/news' },
  { name: 'BBC Sport - Top Sports Stories', url: 'https://feeds.bbci.co.uk/sport/rss.xml' },
  // CBS Sports - All News: Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.

  // Entertainment & Culture
  { name: 'Variety - Latest News', url: 'https://variety.com/feed/' },
  // { name: 'Hollywood Reporter - Latest News', url: 'https://www.hollywoodreporter.com/feed/`' },
  { name: 'Rolling Stone - All Stories', url: 'https://www.rollingstone.com/feed/' },
  { name: 'IGN - Top Stories', url: 'https://feeds.ign.com/ign/all' },

  // Travel
  // Lonely Planet - News: Link cũ 403 Forbidden. Lonely Planet thường giới hạn RSS công khai.
  // National Geographic - Travel: Link cũ 404 Not Found. National Geographic không cung cấp feed RSS công khai.

  // Environment
  // Environmental News Network (ENN): Link cũ 404 Not Found. Không tìm thấy feed RSS công khai mới.
  {
    name: 'ScienceDaily - Environment News',
    url: 'https://www.sciencedaily.com/rss/earth_climate.xml',
  },
]

const parser = new XMLParser({ ignoreAttributes: false })

export async function fetchAllNews() {
  const results = await Promise.all(
    RSS_SOURCES.map(async (source) => {
      try {
        const res = await axios.get(source.url, { responseType: 'text' })
        const data = parser.parse(res.data)
        const items = data.rss?.channel?.item || data.rss?.channel || data.rss || []
        return items.map((item) => ({
          ...item,
          source: source.name,
          url: source.url,
          categories: Array.isArray(item.category)
            ? item.category
            : item.category
              ? [item.category]
              : [],
        }))
      } catch (e) {
        let errorDetail = 'Unknown error'
        if (axios.isAxiosError(e)) {
          errorDetail = e.response?.status + ': ' + (e.response?.statusText || e.message)
        } else if (e instanceof Error) {
          errorDetail = e.message
        }
        console.error(`[RSS ERROR] ${source.name} (${source.url}): ${errorDetail}`)
        return []
      }
    })
  )
  return results.flat()
}
