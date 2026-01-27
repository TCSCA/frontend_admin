import { FC } from "react";
import {
  Home,
  User,
  Settings,
  LogOut,
  LucideIcon,
  LayoutDashboard,
  Briefcase,
  HandCoins,
  Handshake,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Ban, 
  Contact

} from "lucide-react";

// Define los nombres de los íconos que puedes usar.
type IconNames =
  | "Home"
  | "User"
  | "Settings"
  | "LogOut"
  | "LayoutDashboard"
  | "Briefcase"
  | "HandCoins"
  | "Handshake"
  | "Users"
  | "CheckCircle"
  | "Clock"
  | "XCircle"
  | "Award"
  | "Ban"
  | "Contact";

// Define las props del componente.
interface DynamicIconProps {
  nombre: IconNames | string;
  className?: string;
  fill?: string;
  size?: number;
}

// Crea un mapeo explícito de strings a componentes de íconos.
// El tipo `Record<IconNames, LucideIcon>` asegura que el mapeo es correcto.
const iconMap: { [key: string]: React.FC<any> } = {
  Home: Home,
  User: User,
  Settings: Settings,
  LogOut: LogOut,
  LayoutDashboard: LayoutDashboard,
  Briefcase: Briefcase,
  HandCoins: HandCoins,
  Handshake: Handshake,
  Users: Users,
  CheckCircle: CheckCircle,
  Clock: Clock,
  XCircle: XCircle,
  Award: Award,
  Ban: Ban,
  Contact: Contact,
};

const DynamicIcon: FC<DynamicIconProps> = ({ nombre, ...props }) => {
  const IconComponent = iconMap[nombre];

  if (!IconComponent) {
    return null; // Devuelve null si el ícono no existe en el mapa
  }

  // Renderiza el componente de ícono y pasa las props (como `className`).
  return <IconComponent {...props} />;
};

export default DynamicIcon;
