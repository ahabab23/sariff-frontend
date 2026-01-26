import {
  // Financial & Money
  Wallet,
  CreditCard,
  Banknote,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  HandCoins,
  Receipt,
  
  // Business & Office
  Building2,
  Store,
  Briefcase,
  Building,
  Factory,
  Warehouse,
  
  // Users & People
  Users,
  UserCircle,
  UserPlus,
  UserCheck,
  UsersRound,
  Contact,
  IdCard,
  
  // Charts & Analytics
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp as TrendUp,
  AreaChart,
  ChartBar,
  ChartLine,
  
  // Actions & Controls
  Plus,
  Minus,
  X,
  Check,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  HelpCircle,
  
  // Navigation
  Home,
  Menu,
  Search,
  Filter,
  Settings,
  MoreVertical,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  
  // Files & Documents
  FileText,
  File,
  Files,
  Folder,
  FolderOpen,
  FileSpreadsheet,
  FileCheck,
  FileX,
  FilePlus,
  
  // Communication
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  PhoneCall,
  Bell,
  BellRing,
  Send,
  Inbox,
  
  // Status & Indicators
  CheckSquare,
  Square,
  Circle,
  Loader,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  
  // Time & Calendar
  Clock,
  Calendar,
  CalendarDays,
  History,
  Timer,
  Hourglass,
  
  // Security
  Shield,
  Lock,
  Unlock,
  Key,
  ShieldCheck as SecurityCheck,
  Fingerprint,
  Eye,
  EyeOff,
  
  // Media & UI
  Image,
  Video,
  Camera,
  Upload,
  Download,
  Share2,
  Copy,
  Clipboard,
  Link,
  ExternalLink,
  
  // System
  Power,
  LogOut,
  LogIn,
  RefreshCw,
  RotateCw,
  Trash2,
  Edit,
  Edit2,
  Save,
  
  // Special
  Zap,
  Star,
  Heart,
  Award,
  Target,
  Flag,
  Bookmark,
  Tag,
  Package,
  
  // Location & Globe
  Globe,
  MapPin,
  Map,
  Navigation,
  Compass,
  
  // Arrows & Directions
  MoveRight,
  MoveLeft,
  MoveUp,
  MoveDown,
  ArrowUpRight,
  ArrowDownRight,
  
  // Data & Database
  Database,
  Server,
  HardDrive,
  Cpu,
  
  // Misc
  Sparkles,
  Crown,
  Gem,
  Coins,
  Percent,
} from 'lucide-react';

// Curated icon sets for different contexts
export const FinanceIcons = {
  wallet: Wallet,
  card: CreditCard,
  cash: Banknote,
  money: CircleDollarSign,
  coins: Coins,
  revenue: TrendingUp,
  expense: TrendingDown,
  savings: PiggyBank,
  transaction: HandCoins,
  receipt: Receipt,
  invoice: FileText,
  exchange: RefreshCw,
  profit: TrendUp,
  balance: Activity,
};

export const BusinessIcons = {
  office: Building2,
  branch: Store,
  company: Briefcase,
  building: Building,
  headquarters: Factory,
  warehouse: Warehouse,
  client: UserCircle,
  staff: Users,
  team: UsersRound,
  contact: Contact,
};

export const AnalyticsIcons = {
  overview: BarChart3,
  trends: LineChart,
  distribution: PieChart,
  performance: Activity,
  growth: TrendingUp,
  charts: AreaChart,
  metrics: ChartBar,
  reports: ChartLine,
  dashboard: LayoutDashboard,
  insights: Sparkles,
};

export const ActionIcons = {
  create: Plus,
  add: FilePlus,
  remove: Minus,
  delete: Trash2,
  edit: Edit2,
  save: Save,
  close: X,
  cancel: XCircle,
  confirm: Check,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  help: HelpCircle,
};

export const NavigationIcons = {
  home: Home,
  menu: Menu,
  search: Search,
  filter: Filter,
  settings: Settings,
  more: MoreVertical,
  next: ChevronRight,
  previous: ChevronLeft,
  expand: ChevronDown,
  collapse: ChevronUp,
  forward: ArrowRight,
  back: ArrowLeft,
};

export const StatusIcons = {
  active: CheckCircle,
  inactive: Circle,
  pending: Clock,
  approved: CheckSquare,
  rejected: XCircle,
  processing: Loader2,
  alert: AlertTriangle,
  secure: ShieldCheck,
  verified: ShieldCheck,
  premium: Crown,
  featured: Star,
};

export const UserIcons = {
  profile: UserCircle,
  addUser: UserPlus,
  verified: UserCheck,
  team: UsersRound,
  contact: Contact,
  id: IdCard,
  logout: LogOut,
  login: LogIn,
};

export const DocumentIcons = {
  file: FileText,
  folder: Folder,
  invoice: Receipt,
  report: FileSpreadsheet,
  approved: FileCheck,
  rejected: FileX,
  new: FilePlus,
};

export const CommunicationIcons = {
  email: Mail,
  message: MessageSquare,
  chat: MessageCircle,
  phone: PhoneCall,
  notification: Bell,
  send: Send,
  inbox: Inbox,
  alert: BellRing,
};

export const SecurityIcons = {
  security: Shield,
  lock: Lock,
  unlock: Unlock,
  key: Key,
  verified: ShieldCheck,
  biometric: Fingerprint,
  visible: Eye,
  hidden: EyeOff,
};

export const SystemIcons = {
  refresh: RefreshCw,
  rotate: RotateCw,
  upload: Upload,
  download: Download,
  share: Share2,
  copy: Copy,
  link: Link,
  external: ExternalLink,
  power: Power,
};

export const PremiumIcons = {
  premium: Crown,
  vip: Gem,
  featured: Star,
  special: Sparkles,
  exclusive: Award,
  reward: Gift,
  boost: Zap,
  target: Target,
};

// Icon color schemes
export const IconGradients = {
  violet: 'from-violet-500 to-purple-600',
  blue: 'from-blue-500 to-cyan-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-400 to-orange-500',
  rose: 'from-rose-500 to-pink-600',
  indigo: 'from-indigo-500 to-purple-600',
  green: 'from-green-500 to-emerald-600',
  red: 'from-red-500 to-rose-600',
  yellow: 'from-yellow-400 to-amber-500',
  cyan: 'from-cyan-500 to-blue-600',
  purple: 'from-purple-500 to-fuchsia-600',
  slate: 'from-slate-500 to-slate-700',
};

// Contextual icon color mapping
export const IconColors = {
  // Role-based
  superAdmin: IconGradients.violet,
  officeUser: IconGradients.emerald,
  client: IconGradients.blue,
  
  // Status-based
  success: IconGradients.green,
  error: IconGradients.red,
  warning: IconGradients.amber,
  info: IconGradients.blue,
  
  // Feature-based
  financial: IconGradients.emerald,
  analytics: IconGradients.purple,
  security: IconGradients.indigo,
  communication: IconGradients.cyan,
  premium: IconGradients.amber,
};

import { LayoutDashboard, Gift } from 'lucide-react';
