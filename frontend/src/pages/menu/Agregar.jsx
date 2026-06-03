import MenuForm from "../../components/form/MenuForm";
import { FormPage } from "../../components/PageContainer";

const AgregarMenu = () => {
  return (
    <FormPage title="Nuevo menú" subtitle="Ítem de navegación del panel.">
      <MenuForm />
    </FormPage>
  );
};

export default AgregarMenu;
