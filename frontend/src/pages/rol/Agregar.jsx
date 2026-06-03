import RolForm from "../../components/form/RolForm";
import { FormPage } from "../../components/PageContainer";

const AgregarRol = () => {
  return (
    <FormPage title="Nuevo rol" subtitle="Permisos de acceso al sistema.">
      <RolForm />
    </FormPage>
  );
};

export default AgregarRol;
