import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getMenusPorRolTodo } from "../slices/rolMenuSlice";

/** Paths en BD suelen ser relativos (ej. listar-horario); las rutas reales viven bajo /dashboard. */
function resolveMenuPath(menuPath) {
  if (!menuPath || menuPath === "/dashboard") {
    return "/dashboard";
  }
  if (menuPath.startsWith("/dashboard")) {
    return menuPath.replace(/\/+$/, "") || "/dashboard";
  }
  const segment = menuPath.replace(/^\//, "");
  return `/dashboard/${segment}`;
}

export const Sidebar = ({ isOpen, onToggle }) => {
  const { rol } = useSelector((state) => state.auth);
  const { rolMenusGen } = useSelector((state) => state.rolMenu);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (rol?.idRol) {
          await dispatch(getMenusPorRolTodo(rol.idRol)).unwrap();
        }
      } catch (error) {
        console.error("Error al cargar menús:", error);
      }
    };

    fetchMenus();
  }, [dispatch, rol]);

  if (!rol?.idRol) {
    return null;
  }

  const categoryOrder = {
    "Gestión Principal": 1,
    "Gestión Médica": 2,
    "Administración": 3,
    "Configuración": 4
  };

  const orderedMenus = [...rolMenusGen].sort((a, b) => {
    const aPath = a.menu?.path ?? "";
    const bPath = b.menu?.path ?? "";
    const aName = a.menu?.nombre ?? "";
    const bName = b.menu?.nombre ?? "";
    const aCategory = a.menu?.categoriaNombre ?? a.menu?.categoria?.nombre ?? "Gestión Principal";
    const bCategory = b.menu?.categoriaNombre ?? b.menu?.categoria?.nombre ?? "Gestión Principal";
    const aOrder = Number.isFinite(a.menu?.orden) ? a.menu.orden : Number.MAX_SAFE_INTEGER;
    const bOrder = Number.isFinite(b.menu?.orden) ? b.menu.orden : Number.MAX_SAFE_INTEGER;
    const aIsDashboard = aPath === "/dashboard";
    const bIsDashboard = bPath === "/dashboard";

    if (aIsDashboard && !bIsDashboard) return -1;
    if (!aIsDashboard && bIsDashboard) return 1;

    const aCategoryOrder = categoryOrder[aCategory] ?? Number.MAX_SAFE_INTEGER;
    const bCategoryOrder = categoryOrder[bCategory] ?? Number.MAX_SAFE_INTEGER;

    if (aCategoryOrder !== bCategoryOrder) {
      return aCategoryOrder - bCategoryOrder;
    }

    if (aCategory !== bCategory) {
      return aCategory.localeCompare(bCategory, "es", { sensitivity: "base" });
    }

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return aName.localeCompare(bName, "es", { sensitivity: "base" });
  });

  const groupedMenus = orderedMenus.reduce((acc, item) => {
    const category = item.menu?.categoriaNombre || item.menu?.categoria?.nombre || "Gestión Principal";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out fixed left-0 top-0 z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className={`font-bold text-xl text-sky-800 ${!isOpen && 'hidden'}`}>Consultorio</h2>
        <button 
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Contraer menú lateral" : "Expandir menú lateral"}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-2 overflow-y-auto h-[calc(100vh-5rem)]">
        {Object.entries(groupedMenus).map(([category, items]) => (
          <div key={category} className="mb-4">
            {isOpen && (
              <h3 className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-gray-500">
                {category}
              </h3>
            )}
            <div className="space-y-1 px-2">
              {items.map((item) => {
                const to = resolveMenuPath(item.menu.path);

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 border-l-4 ${
                        isActive
                          ? "bg-sky-100 text-sky-800 font-semibold border-sky-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-sky-600 border-transparent"
                      } ${!isOpen ? "justify-center border-l-0" : ""}`
                    }
                  >
                    <span className={`${!isOpen ? "text-center w-full" : ""}`}>
                      {isOpen ? item.menu.nombre : item.menu.nombre.charAt(0)}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
