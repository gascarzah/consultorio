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
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-30 bg-black/40 lg:hidden"
          aria-label="Cerrar menú"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-14 z-40 flex shrink-0 flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'
        } lg:static lg:top-auto lg:z-auto lg:min-h-[calc(100dvh-3.5rem)]`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className={`truncate font-semibold text-sky-800 ${!isOpen && 'lg:hidden'}`}>
            Consultorio
          </h2>
          <button
            type="button"
            onClick={onToggle}
            className="hidden rounded-md p-2 text-gray-500 hover:bg-white lg:inline-flex"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Contraer menú lateral" : "Expandir menú lateral"}
          >
            {isOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {Object.entries(groupedMenus).map(([category, items]) => (
            <div key={category} className="mb-5">
              {isOpen && (
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {category}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const to = resolveMenuPath(item.menu.path);

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/dashboard"}
                      title={!isOpen ? item.menu.nombre : undefined}
                      className={({ isActive }) =>
                        `flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                            : "text-gray-700 hover:bg-white/80 hover:text-gray-900"
                        } ${!isOpen ? "lg:justify-center lg:px-2" : "gap-2"}`
                      }
                    >
                      <span className={`${!isOpen ? "lg:text-xs lg:font-bold" : "truncate"}`}>
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
    </>
  );
};
