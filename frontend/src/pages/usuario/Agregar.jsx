import { FormPage } from "../../components/PageContainer";
import UsuarioForm from "../../components/form/UsuarioForm";

const AgregarUsuario = () => {
  return (
    <FormPage title="Nuevo usuario" subtitle="Asigna empresa, rol y empleado vinculado.">
      <UsuarioForm />
    </FormPage>
  );
};

export default AgregarUsuario;
