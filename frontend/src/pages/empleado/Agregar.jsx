import { EmpleadoForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarEmpleado = () => {
  return (
    <FormPage title="Nuevo empleado" subtitle="Registra datos personales y tipo de personal.">
      <EmpleadoForm />
    </FormPage>
  );
};

export default AgregarEmpleado;
