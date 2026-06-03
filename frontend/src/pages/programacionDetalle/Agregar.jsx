import { ProgramacionDetalleForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarProgramacionDetalle = () => {
  return (
    <FormPage title="Detalle de programación" subtitle="Asigna días y médicos al bloque horario." maxWidth="max-w-4xl">
      <ProgramacionDetalleForm />
    </FormPage>
  );
};

export default AgregarProgramacionDetalle;
