import TipoEmpleadoForm from "../../components/form/TipoEmpleadoForm";
import { FormPage } from "../../components/PageContainer";

const AgregarTipoEmpleado = () => {
  return (
    <FormPage title="Nuevo tipo de empleado" subtitle="Define roles operativos del personal.">
      <TipoEmpleadoForm />
    </FormPage>
  );
};

export default AgregarTipoEmpleado;
