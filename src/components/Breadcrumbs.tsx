
import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeNameMap: Record<string, string> = {
  '': 'Home',
  'complaints': 'Complaints',
  'track': 'Track Status',
  'services': 'Services',
  'about': 'About',
  'contact': 'Contact',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(path => path !== '');
  
  // Don't show breadcrumbs on home page
  if (paths.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <HomeIcon className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {paths.map((path, index) => {
            const routePath = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            const displayName = routeNameMap[path] || path;
            
            return isLast ? (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={path}>
                <BreadcrumbLink asChild>
                  <Link to={routePath}>{displayName}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
