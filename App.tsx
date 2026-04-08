import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, ReferenceDot } from 'recharts';
import { 
  Upload, 
  RefreshCcw, 
  AlertCircle, 
  Shield, 
  TrendingUp, 
  ChevronLeft,
  Crown,
  Gem,
  Sparkles,
  Medal,
  Award,
  Target,
  Key,
  Zap,
  Coins,
  Brain,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Analytics } from '@vercel/analytics/react';

// --- Types ---
interface Scores {
  base: number;
  wealth: number;
  power: number;
  wisdom: number;
  romance: number;
  risk: number;
}

interface AnalysisDetail {
  aspect: string;
  content: string;
}

interface AnalysisResult {
  tier: string;
  tierDescription: string;
  title: string;
  scores: Scores;
  summary: string;
  yearlyForecast?: string;
  details: AnalysisDetail[];
}

// --- Components ---

const DisclaimerSection = () => (
  <div className="pt-4 flex flex-col items-center gap-3">
    <p className="text-indigo-300/80 text-sm max-w-3xl mx-auto italic text-center leading-relaxed">
      * Lưu ý: Các kết quả phân tích bằng AI dưới đây mang tính chất vui vẻ và tham khảo là chính. Lời khuyên là bạn vẫn nên tham khảo ý kiến của những người luận giải tử vi có trình độ. Để luận giải chi tiết các bạn có thể liên hệ tôi qua Zalo:{' '}
      <a href="https://zalo.me/0347522472" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-200 hover:text-indigo-100 underline transition-colors">
        0347522472
      </a>
    </p>
  </div>
);

const normalDistribution = (x: number, mean: number, stdDev: number) => {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
};

const BellCurveChart = ({ beats }: { beats: number }) => {
  const data = [];
  const mean = 100;
  const stdDev = 15;
  
  // Generate smoother curve
  for (let i = 50; i <= 150; i += 1) {
    data.push({
      x: i,
      y: normalDistribution(i, mean, stdDev),
    });
  }

  const getZScore = (p: number) => {
    if (p >= 0.99) return 2.33;
    if (p >= 0.95) return 1.645;
    if (p >= 0.90) return 1.28;
    if (p >= 0.80) return 0.84;
    if (p >= 0.70) return 0.52;
    if (p >= 0.50) return 0;
    if (p >= 0.30) return -0.52;
    if (p >= 0.20) return -0.84;
    if (p >= 0.10) return -1.28;
    return -1.645;
  };

  const zScore = getZScore(beats / 100);
  const userX = mean + zScore * stdDev;
  const userY = normalDistribution(userX, mean, stdDev);

  return (
    <div className="h-48 w-full mt-4 relative group">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCurve" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <XAxis dataKey="x" type="number" domain={[50, 150]} hide />
          <YAxis hide />
          <Area 
            type="monotone" 
            dataKey="y" 
            stroke="#8b5cf6" 
            strokeWidth={3} 
            fill="url(#colorCurve)" 
            isAnimationActive={true} 
            animationDuration={1500}
          />
          
          {/* Highlighting the "Elite" zone if user is in top tiers */}
          {beats >= 80 && (
            <Area
              type="monotone"
              dataKey="y"
              stroke="none"
              fill="#fbbf24"
              fillOpacity={0.1}
              baseData={data.filter(d => d.x >= 115)}
              isAnimationActive={false}
            />
          )}

          {/* Custom Marker: Glowing Line */}
          <ReferenceLine 
            x={userX} 
            stroke="#fbbf24" 
            strokeWidth={3} 
            strokeDasharray="4 2"
            className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
          />
          
          <ReferenceDot 
            x={userX} 
            y={userY} 
            r={6} 
            fill="#fbbf24" 
            stroke="#fff" 
            strokeWidth={2}
            className="animate-pulse"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Dynamic Floating Label */}
      <div 
        className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none transition-all duration-1000 ease-out"
        style={{ 
          left: `${((userX - 50) / 100) * 100}%`,
        }}
      >
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.4)] flex items-center gap-1"
        >
          <Crown className="w-3 h-3" /> BẠN
        </motion.div>
        <div className="w-0.5 h-6 bg-gradient-to-b from-yellow-400 to-transparent" />
      </div>

      {/* Zone Indicators */}
      <div className="absolute bottom-1 left-0 w-full flex justify-between px-4 text-[8px] font-bold text-indigo-300/30 uppercase tracking-widest">
        <span>Phổ thông</span>
        <span>Trung lưu</span>
        <span className={cn(beats >= 90 ? "text-yellow-400/60" : "text-pink-400/40")}>
          {beats >= 90 ? "Huyền thoại" : "Hiếm có"}
        </span>
      </div>
    </div>
  );
};

const GuideSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 md:p-8 shadow-xl"
  >
    <h3 className="text-xl font-bold text-indigo-100 mb-6 flex items-center gap-2">
      <Zap className="w-5 h-5 text-yellow-400" /> Hướng dẫn sử dụng
    </h3>
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">1</div>
        <div>
          <p className="text-indigo-100 font-medium mb-1 text-[15px]">Lấy lá số Tử Vi</p>
          <p className="text-indigo-300/70 text-sm leading-relaxed">
            Truy cập các website như <a href="https://tuvivietnam.vn/lasotuvi/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">tuvivietnam.vn</a> hoặc <a href="https://lasotuvi.vn/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">lasotuvi.vn</a> để lấy lá số của bạn.
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">2</div>
        <div>
          <p className="text-indigo-100 font-medium mb-1 text-[15px]">Tải ảnh lá số lên hệ thống</p>
          <p className="text-indigo-300/70 text-sm leading-relaxed">
            Chụp màn hình hoặc tải ảnh lá số về máy, sau đó kéo thả hoặc nhấn vào mục <strong>"Tải ảnh lá số"</strong> ở phía dưới để bắt đầu luận giải.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

const RadarChart = ({ scores }: { scores: Scores }) => {
  const size = 300;
  const cx = 150;
  const cy = 150;
  const maxRadius = 110;
  const minVal = -2;
  const maxVal = 12;

  const maxScore = Math.max(
    scores.base || 0,
    scores.wealth || 0,
    scores.power || 0,
    scores.wisdom || 0,
    scores.romance || 0,
    scores.risk || 0
  );

  const metrics = [
    { key: 'power', label: 'Power', color: '#ef4444' },
    { key: 'wealth', label: 'Wealth', color: '#eab308' },
    { key: 'base', label: 'Base', color: '#22c55e' },
    { key: 'risk', label: 'Risk', color: '#f97316' },
    { key: 'romance', label: 'Romance', color: '#ec4899' },
    { key: 'wisdom', label: 'Wisdom', color: '#3b82f6' }
  ] as const;

  const getPoint = (val: number, angleIndex: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const r = ((clamped - minVal) / (maxVal - minVal)) * maxRadius;
    const angleRad = (angleIndex * 60 - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad)
    };
  };

  // Grid levels
  const gridLevels = [1, 2, 3, 4].map(level => {
    const val = minVal + (maxVal - minVal) * (level / 4);
    const pts = metrics.map((_, i) => getPoint(val, i));
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Axes
  const axes = metrics.map((_, i) => getPoint(maxVal, i));

  // Data polygon
  const dataPts = metrics.map((m, i) => getPoint(scores?.[m.key as keyof Scores] || 0, i));
  const dataPolyStr = dataPts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible absolute">
        {/* Grids */}
        {gridLevels.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="#334155" strokeWidth="1" className="opacity-50" />
        ))}
        {/* Axes */}
        {axes.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#334155" strokeWidth="1" />
        ))}
        {/* Data Area */}
        <motion.polygon 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          points={dataPolyStr} 
          className="fill-purple-500/20 stroke-purple-500 stroke-[3px] stroke-linejoin-round" 
        />
        {/* Data Points */}
        {dataPts.map((p, i) => {
          const scoreVal = scores?.[metrics[i].key as keyof Scores] || 0;
          const isMax = scoreVal === maxScore && scoreVal > 0;
          return (
            <circle key={i} cx={p.x} cy={p.y} r={isMax ? "6" : "4"} fill={isMax ? "#fbbf24" : "#a78bfa"} stroke={isMax ? "#fff" : "none"} strokeWidth={isMax ? "2" : "0"} />
          );
        })}
      </svg>
      {/* Labels */}
      {metrics.map((m, i) => {
        const scoreVal = scores?.[m.key as keyof Scores] || 0;
        const isMax = scoreVal === maxScore && scoreVal > 0;
        const angleRad = (i * 60 - 90) * (Math.PI / 180);
        const p = {
          x: cx + (maxRadius + 25) * Math.cos(angleRad),
          y: cy + (maxRadius + 25) * Math.sin(angleRad)
        };
        return (
          <div 
            key={m.key}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
          >
            <span className={cn("text-[10px] font-bold px-1.5 rounded uppercase tracking-wider flex items-center gap-0.5", isMax ? "bg-yellow-400/20 ring-1 ring-yellow-400/50" : "")} style={{ color: isMax ? '#fbbf24' : m.color }}>
              {isMax && <Crown className="w-3 h-3" />}
              {m.label}
            </span>
            <span className={cn("text-[10px] font-mono px-1 rounded", isMax ? "text-yellow-400 bg-yellow-400/10 font-bold" : "text-slate-300 bg-slate-800")}>{scoreVal}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [apiKey, setApiKey] = useState(process.env.GEMINI_API_KEY || '');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Vui lòng nhập Google Gemini API Key để tiếp tục!');
      return;
    }
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      setLoadingStatus('1. Đang quét dữ liệu 4 cường cung...');
      await new Promise(r => setTimeout(r, 800));
      setLoadingStatus('2. Đối chiếu dữ liệu tại hệ thống Score 8.0...');
      await new Promise(r => setTimeout(r, 1200));
      setLoadingStatus('3. Đang chạy thuật toán AI phân tích...');

      const ai = new GoogleGenAI({ apiKey });
      const base64Data = image.split(',')[1];

      const systemPrompt = `Bạn là siêu AI Tử Vi sử dụng độc quyền thuật toán "Score Ver 8.0".
TUÂN THỦ TUYỆT ĐỐI CÁC QUY TẮC LÕI:
1. BƯỚC 1: Quét chính xác 4 cường cung: Mệnh, Tài, Quan, Thiên Di/Thân. Định vị chính xác Tuần/Triệt đang đóng ở đâu.
2. BƯỚC 2 (BẮT BUỘC): Tất cả dữ liệu về điểm sao, phải được check điểm số dựa trên bảng dữ liệu của link drive này (bắt buộc): https://docs.google.com/spreadsheets/d/1Y8uPc_RwWdaXxQxgRF_xtHaGHj-nau3_bnRg2dPoeY0/edit?gid=625639460#gid=625639460. TUYỆT ĐỐI KHÔNG TỰ BỊA ĐIỂM.
3. KHÔNG LẶP ĐIỂM. Lộc Tồn BẤT NHIỄM với Triệt. Gộp "Package Vòng Lộc Tồn".
4. Sao cấp 3 (Khôi Việt, Long Phượng...) chỉ tô điểm (+-0.5 đến 1.0).
5. TÍNH NHẤT QUÁN TUYỆT ĐỐI (QUAN TRỌNG NHẤT): Cùng một lá số, bạn BẮT BUỘC phải luôn đưa ra một kết quả điểm số giống hệt nhau 100% ở mọi lần phân tích. Hãy áp dụng công thức toán học cố định dựa trên các sao, tuyệt đối không ước lượng cảm tính hay random.
6. CHẤM ĐIỂM: Chấm điểm khắt khe hơn khoảng 15% so với bình thường để phân loại rõ ràng hơn. CHỈ cho điểm cao vượt trội (đột biến) nếu lá số sở hữu các cách cục cực đắt giá như: Tam Kỳ Gia Hội (BẮT BUỘC phải hội đủ 3 sao Hóa Khoa, Hóa Lộc, Hóa Quyền tại 4 cung Mệnh, Tài, Quan, Thiên Di; Hóa Kỵ KHÔNG được tính là Tam Hóa), Song Lộc, Tham Hỏa, Tử Phủ triều viên...
- ĐỐI VỚI LÁ SỐ XẤU: Nếu lá số gặp nhiều sát tinh hãm địa, chính tinh hãm địa mà KHÔNG có các bộ sao cứu giải (như Tam Kỳ Gia Hội, Tuần/Triệt đúng chỗ, cát tinh hội tụ...), hãy áp dụng hệ số nhân 0.9 cho toàn bộ điểm số để thể hiện sự khắt khe và thực tế.
7. HẠ CÁCH VÀ LỤC SÁT TINH: Cần làm rõ s�� lượng và vị trí Lục Sát Tinh (Kình, Đà, Linh, Hỏa, Không, Kiếp) tại Mệnh, Tài, Quan, Di, Thân.
- Lục Sát Tinh Đắc Địa (D): Không xấu. Nếu gặp bộ Mệnh Sát Phá Tham còn làm tăng mạnh Power, Wealth và Risk.
- Lục Sát Tinh Hãm Địa (H): Rất xấu. Nếu có từ 3 sát tinh (H) trở lên tại Mệnh, Tài, Quan, Di, Thân thì phải hạ cấp độ (Tier) lá số. Đặc biệt giảm nặng với Mệnh Cơ Nguyệt Đồng Lương, Tử Phủ. Với Mệnh Sát Phá Tham thì giảm Tier ít hơn. Đặc biệt với Mệnh Liêm Tham (Tỵ Hợi), chỉ coi là phá cách nếu hội từ 3 Lục Sát Tinh (H) trở lên; dưới 3 thì bình thường.
- Sát tinh không làm mất cách cục: Có Lục Sát Tinh vẫn không ảnh hưởng tới các cách cục đặc biệt. Ví dụ: Cách cục Tham Hỏa (Tham Lang gặp Hỏa Tinh) bản chất là Sát Phá Tham gặp sát tinh, cách này làm tăng độ giàu (Wealth) và Risk chứ không bị giảm điểm.
8. CÁCH CỤC ĐẶC BIỆT: Thêm điểm thưởng (đặc biệt tăng mạnh Wealth và Risk) cho cách cục "Tham Hỏa Tương Phùng" hoặc "Tham Linh Triều Viên". Điều kiện: Mệnh hoặc Thân có Tham Lang, đồng thời tại Mệnh/Thân hoặc tam phương tứ chính (Tài, Quan, Di) có Hỏa Tinh hoặc Linh Tinh (không bắt buộc phải đồng cung). Cách cục này mang tính bạo phát, tuy nhiên sức mạnh tổng thể không bằng Tam Kỳ Gia Hội.
- CÁCH CỤC NHẬT NGUYỆT TỊNH MINH: Chỉ công nhận cách cục này khi cung Mệnh Vô Chính Diệu tại Mùi, có Thái Dương (Tỵ) và Thái Âm (Dậu) đắc địa cùng chiếu về. Các trường hợp khác không được coi là Nhật Nguyệt Tịnh Minh chuẩn cách.
9. GIÁP CÁCH (CUNG GIÁP): Khi xét cung Mệnh, cần lưu ý thêm các sao ở hai cung giáp (bên cạnh). 
- Giáp Không Kiếp: Rất xấu (vì Không Kiếp khi giáp cung luôn hãm địa), làm giảm điểm Base và tăng Risk.
- Giáp Kình Đà: Lưu ý rằng Kình Đà luôn kẹp giữa Lộc Tồn. Nếu Mệnh giáp Kình Đà thì Mệnh có Lộc Tồn, đây là cách cục tốt, không được coi là xấu.
- Giáp cách tốt: Ví dụ Giáp Song Lộc (Mệnh được kẹp bởi 2 sao Lộc), Giáp Khoa Quyền... cần được cộng điểm thưởng.
10. BỎ QUA SAO LƯU KHI TÍNH ĐIỂM: Các sao có tiền tố "L." ở đầu (ví dụ: L.Lộc Tồn, L.Kình Dương, L.Đà La...) là sao lưu theo năm. TUYỆT ĐỐI KHÔNG tính điểm các sao này vào điểm độ số và các chỉ số (Base, Wealth, Power...).
11. HẠN NĂM NAY: Tìm cung có chứa sao "L.Thái Tuế" để xem hạn. Luận giải ngắn gọn về biến động trong năm nay xoay quanh chủ đề của cung đó. TUYỆT ĐỐI KHÔNG ĐƯỢC NHẮC ĐẾN TỪ "Lưu Thái Tuế" hay "L.Thái Tuế" trong bài luận, chỉ nói chung chung về biến động vấn đề gì (ví dụ: "Năm nay biến động mạnh về công việc..."). Nếu cung đó đẹp thì tín hiệu tốt, xấu thì tín hiệu xấu. Nếu lá số KHÔNG CÓ sao "L.Thái Tuế", hãy bỏ qua và để trống trường "yearlyForecast".
12. CHỈ SỐ RISK (ĐỘ HUNG HIỂM): Ngoài Mệnh/Tài/Quan/Di, chỉ số này còn phụ thuộc vào cung Phúc Đức và cung Tật Ách.
    - Cung Tật Ách: Nếu có Tuần hoặc Triệt đóng tại đây thì sẽ làm giảm đáng kể độ hung hiểm (Risk giảm).
    - Cung Phúc Đức: Nếu cung Phúc tốt (nhiều cát tinh, chính tinh sáng) thì giảm Risk; nếu cung Phúc xấu (nhiều sát tinh, phá cách) thì tăng Risk.
13. CHỈ SỐ WEALTH (TIỀN TÀI): Ngoài Mệnh/Tài/Quan, chỉ số này còn phụ thuộc một phần nhỏ vào cung Điền Trạch. Nếu cung Điền tốt thì có thể tăng thêm mức tiền tài, nhưng trọng số ảnh hưởng ít hơn so với tam phương tứ chính Mệnh Tài Quan.
14. CHỈ SỐ ROMANCE (ĐÀO HOA/CÔ ĐỘC): Đây thuần túy là chỉ số về sự đào hoa, sức hút cá nhân hoặc sự cô độc, KHÔNG liên quan đến đường gia đạo hay hạnh phúc gia đình.

Chấm điểm chuẩn xác cho 6 trục. Thang điểm từ 0 đến 12 (10 là rất cao, 12 là cực kỳ hiếm): base, wealth, power, wisdom, romance, risk.

Phân loại Tier và tierDescription tương ứng:
- S: Đại thượng cách (Top 1%)
- A+: Thượng cách (Top 5%)
- A: Thượng cách (Top 10%)
- A- đến B+: Tiểu cách (Top 20%)
- B: Tiểu cách (Top 50%)
- C: Trung cách (Top 70%)
- C- đến D+: Tạp cách (Top 80%)
- D trở xuống: Hạ cách (Top 90%)

Bạn phải trả về ĐÚNG định dạng JSON sau:
{
  "tier": "S/A+/A/A-/B+/B/C/C-/D+/D...", 
  "tierDescription": "Đại thượng cách/Thượng cách...",
  "title": "[Tên Chính Tinh thủ Mệnh] + [Cách cục nếu có]. Ví dụ: 'Cơ Âm - Tam Kỳ Gia Hội' hoặc 'Vô Chính Diệu - Nhật Nguyệt Tịnh Minh'. TUYỆT ĐỐI KHÔNG SÁNG TẠO THÊM CÚ PHÁP KHÁC.", 
  "scores": {"base": 0, "wealth": 0, "power": 0, "wisdom": 0, "romance": 0, "risk": 0}, 
  "summary": "Bình luận tổng quan", 
  "yearlyForecast": "Phân tích ngắn hạn năm nay (tuyệt đối không nhắc đến từ Lưu Thái Tuế), nếu không có L.Thái Tuế thì để chuỗi rỗng",
  "details": [{"aspect": "Khía cạnh", "content": "Nội dung bóc tách"}]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt + "\n\nPhân tích lá số trong ảnh này theo Score 8.0, trả về JSON." },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.0,
          topK: 1,
          topP: 0.1
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error('Không nhận được phản hồi từ AI.');
      
      const parsedResult = JSON.parse(resultText) as AnalysisResult;
      setResult(parsedResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi phân tích hình ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const reset = () => {
    setResult(null);
    setImage(null);
    setError(null);
  };

  const getTierStyles = (tier: string) => {
    if (!tier) return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    if (tier.includes('S')) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (tier.includes('A')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    if (tier.includes('B')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (tier.includes('C')) return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getPercentile = (tier: string) => {
    if (!tier) return { top: 100, beats: 0 };
    const t = tier.toUpperCase().trim();
    
    if (t === 'S') return { top: 1, beats: 99 };
    if (t === 'A+') return { top: 5, beats: 95 };
    if (t === 'A') return { top: 10, beats: 90 };
    if (t === 'A-' || t === 'B+') return { top: 20, beats: 80 };
    if (t === 'B' || t === 'B-') return { top: 50, beats: 50 };
    if (t === 'C+' || t === 'C') return { top: 70, beats: 30 };
    if (t === 'C-' || t === 'D+') return { top: 80, beats: 20 };
    return { top: 90, beats: 10 };
  };

  const getTierIcon = (tier: string) => {
    if (!tier) return <Target className="w-6 h-6 text-gray-400" />;
    if (tier.includes('S')) return <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
    if (tier.includes('A+')) return <Gem className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />;
    if (tier.includes('A')) return <Sparkles className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />;
    if (tier.includes('B')) return <Medal className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />;
    if (tier.includes('C+')) return <Award className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />;
    if (tier.includes('C')) return <Shield className="w-6 h-6 text-gray-400" />;
    return <Target className="w-6 h-6 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-4 md:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tử Vi Độ Số Score Ver 8.0
          </h1>
          <p className="text-indigo-200/70 max-w-2xl mx-auto text-sm md:text-base">
            Hệ thống sinh trắc học định lượng cực đoan. Phân tích lá số bằng AI với độ chính xác và kỷ luật thép của thuật toán 8.0.
          </p>
          <DisclaimerSection />
        </motion.div>

        {!result ? (
          <div className="space-y-8">
            {/* Guide Section */}
            <GuideSection />

            {/* API Key Config */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-[#131b2f] border border-indigo-500/20 rounded-xl p-6 shadow-lg shadow-indigo-500/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-indigo-400" />
                <label className="block text-sm font-medium text-indigo-200/80">Google Gemini API Key</label>
              </div>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập API Key bắt đầu bằng AIzaSy..." 
                className="w-full bg-[#0a0f1c] border border-indigo-500/30 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-600"
              />
              <p className="text-xs text-indigo-300/50 mt-2">
                Lấy API Key miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>.
              </p>
            </motion.div>

            {/* Upload Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-[#131b2f] border border-indigo-500/20 rounded-2xl p-8 shadow-2xl shadow-indigo-500/10 transition-all"
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all group",
                  image ? "border-indigo-500/30" : "border-indigo-500/20 hover:border-indigo-400/50 bg-[#0a0f1c]/50 hover:bg-[#0a0f1c]"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/*" 
                />
                
                {!image ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#1a233a] shadow-sm border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-indigo-100">Nhấn để tải ảnh lá số Tử Vi lên</p>
                      <p className="text-sm text-indigo-300/60 mt-1">Hỗ trợ JPG, PNG</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-indigo-500/30 relative">
                      <img src={image} alt="Lá số" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCcw className="w-8 h-8 text-indigo-200 opacity-70" />
                      </div>
                    </div>
                    <p className="text-sm text-indigo-300/60">Nhấn vào ảnh để đổi lá số khác</p>
                  </div>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button 
                onClick={handleAnalyze}
                disabled={!image || loading}
                className={cn(
                  "w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg flex flex-col items-center justify-center gap-2",
                  (!image || loading) && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-normal text-purple-200">{loadingStatus}</span>
                  </>
                ) : (
                  <span>Kích hoạt bộ quét Score 8.0</span>
                )}
              </button>

              <div className="mt-6 text-center text-sm text-indigo-300/70 space-y-1">
                <p>Lá số đăng tải, upload phải là ảnh rõ ràng, không mờ, khó nhìn.</p>
                <p>Website lấy lá số tham khảo: <a href="https://tuvivietnam.vn/lasotuvi/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">https://tuvivietnam.vn/lasotuvi/</a></p>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Result Section */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Cột trái: Biểu đồ & Xếp hạng */}
            <div className="lg:col-span-5 bg-[#131b2f] border border-indigo-500/20 rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 flex flex-col items-center">
              <div className="w-full flex justify-start mb-6">
                <button 
                  onClick={reset}
                  className="text-sm text-indigo-300/70 hover:text-indigo-200 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Quét lá số khác
                </button>
              </div>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn("px-6 py-2 rounded-full border text-2xl font-black tracking-wider mb-2 flex items-center gap-3", getTierStyles(result.tier))}
              >
                {getTierIcon(result.tier)}
                {result.tier}
              </motion.div>
              <div className="text-sm font-medium text-indigo-300/80 mb-4 uppercase tracking-widest">{result.tierDescription}</div>
              <h2 className="text-xl font-bold text-indigo-100 mb-8 text-center px-4 italic">
                "{result.title}"
              </h2>

              {/* Radar Chart */}
              <RadarChart scores={result.scores || { base: 0, wealth: 0, power: 0, wisdom: 0, romance: 0, risk: 0 }} />

              <div className="w-full mt-8 grid grid-cols-2 gap-3 text-sm">
                {[
                  { key: 'base', label: 'Base', icon: Shield, color: 'text-green-400' },
                  { key: 'power', label: 'Power', icon: Zap, color: 'text-red-400' },
                  { key: 'wealth', label: 'Wealth', icon: Coins, color: 'text-yellow-400' },
                  { key: 'wisdom', label: 'Wisdom', icon: Brain, color: 'text-blue-400' },
                  { key: 'romance', label: 'Romance', icon: Heart, color: 'text-pink-400' },
                  { key: 'risk', label: 'Risk', icon: AlertCircle, color: 'text-orange-400' },
                ].map((item) => {
                  const maxScore = Math.max(
                    result.scores?.base || 0,
                    result.scores?.wealth || 0,
                    result.scores?.power || 0,
                    result.scores?.wisdom || 0,
                    result.scores?.romance || 0,
                    result.scores?.risk || 0
                  );
                  const scoreVal = result.scores?.[item.key as keyof Scores] || 0;
                  const isMax = scoreVal === maxScore && scoreVal > 0;
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className={cn("p-3 rounded-lg border flex justify-between items-center transition-all", isMax ? "bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.15)] scale-105 z-10" : "bg-[#0a0f1c] border-indigo-500/10")}>
                      <div className="flex items-center gap-2 text-indigo-200/70">
                        <Icon className={cn("w-4 h-4", isMax ? "text-yellow-400" : item.color)} />
                        <span className={isMax ? "text-yellow-400 font-bold" : ""}>{item.label}:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isMax && <Crown className="w-3 h-3 text-yellow-400" />}
                        <span className={cn("font-mono font-bold", isMax ? "text-yellow-400 text-lg" : item.color)}>{scoreVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Percentile Distribution */}
              <div className="w-full mt-6 bg-[#0a0f1c] border border-indigo-500/20 rounded-xl p-5 shadow-inner">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-medium text-indigo-200/80">Phân phối người dùng</span>
                  <span className="text-lg font-black text-purple-400">Top {getPercentile(result.tier).top}%</span>
                </div>
                
                <BellCurveChart beats={getPercentile(result.tier).beats} />

                <p className="text-sm text-indigo-300/80 text-center mt-3">
                  Lá số này nằm trong <strong className="text-indigo-200 font-bold">top {getPercentile(result.tier).top}%</strong>, vượt qua <strong className="text-indigo-200 font-bold">{getPercentile(result.tier).beats}%</strong> người.
                  <br />
                  <span className="text-xs italic opacity-70">(Cứ {Math.round(100 / getPercentile(result.tier).top)} người mới có 1 người sở hữu lá số tương tự bạn)</span>
                </p>
              </div>

              {/* Score Explanations */}
              <div className="mt-6 text-sm text-indigo-300/80 space-y-3 border-t border-indigo-500/20 pt-5 w-full text-left">
                <p><strong className="text-indigo-200 text-[15px]">Base (Độ số chung):</strong> Điểm số chung tổng thể gốc của lá số có vững vàng hay không.</p>
                <p><strong className="text-indigo-200 text-[15px]">Power:</strong> Quyền lực, địa vị, khả năng lãnh đạo.</p>
                <p><strong className="text-indigo-200 text-[15px]">Wealth:</strong> Tài lộc, tiền bạc, khả năng kiếm tiền (phụ thuộc Mệnh/Tài/Quan và một phần cung Điền Trạch).</p>
                <p><strong className="text-indigo-200 text-[15px]">Wisdom:</strong> Trí tuệ, học vấn, tư duy.</p>
                <p><strong className="text-indigo-200 text-[15px]">Romance:</strong> Chỉ số về sự đào hoa, sức hút cá nhân hoặc sự cô độc, không liên quan đến đường gia đạo.</p>
                <p><strong className="text-indigo-200 text-[15px]">Risk:</strong> Độ rủi ro hung hiểm, biến cố (phụ thuộc Mệnh/Tài/Quan/Di và cung Phúc Đức, Tật Ách). Điểm càng thấp thì lá số càng an toàn.</p>
              </div>
            </div>

            {/* Cột phải: Phân tích chi tiết */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#131b2f] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-indigo-500/10">
                  <Shield className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-indigo-100">Đôi chút chấm phá về lá số của bạn</h3>
                </div>
                <p className="text-indigo-200/80 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {result.summary}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300/80 italic flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p>Các kết quả này có thể có sự sai lệch nhất định. Bạn chỉ nên upload 1 lá số 1-2 lần để tránh làm AI giảm chất lượng đọc và phân tích.</p>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-[#131b2f] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-bold text-indigo-100">Bóc tách Vi mạch Cường cung</h3>
                </div>
                <div className="space-y-4">
                  {result.details.map((d, i) => (
                    <div key={i} className="bg-[#0a0f1c] p-5 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
                      <h4 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-wider">{d.aspect}</h4>
                      <p className="text-indigo-200/80 text-sm leading-relaxed">{d.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {result.yearlyForecast && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#131b2f] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10"
                >
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-indigo-500/10">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-indigo-100">Dự báo Hạn Năm Nay</h3>
                  </div>
                  <p className="text-indigo-200/80 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {result.yearlyForecast}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer Disclaimer */}
        <div className="pt-8 border-t border-indigo-500/10">
          <DisclaimerSection />
        </div>
      </div>
      <Analytics />
    </div>
  );
}
