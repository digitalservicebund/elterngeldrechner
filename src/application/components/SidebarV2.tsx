type Props = {
  readonly navigationItems: string[];
  readonly currentNavigationItem: string;
};

export function SidebarV2({
  navigationItems: _navigationItems,
  currentNavigationItem: _currentNavigationItem,
}: Props) {
  return (
    <nav>
      <h4>Navigationsleiste</h4>
    </nav>
  );
}
