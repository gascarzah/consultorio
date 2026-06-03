import EmpresaForm from "../../components/form/EmpresaForm";
import { FormPage } from "../../components/PageContainer";

const AgregarEmpresa = () => {
  return (
    <FormPage title="Nueva empresa" subtitle="Datos del consultorio o sede.">
      <EmpresaForm />
    </FormPage>
  );
};

export default AgregarEmpresa;
