import CategoriaMenuForm from "../../components/form/CategoriaMenuForm";
import { FormPage } from "../../components/PageContainer";

const AgregarCategoriaMenu = () => {
  return (
    <FormPage title="Nueva categoría de menú" subtitle="Agrupa ítems del menú lateral.">
      <CategoriaMenuForm />
    </FormPage>
  );
};

export default AgregarCategoriaMenu;
