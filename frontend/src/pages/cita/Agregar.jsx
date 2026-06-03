import { CitaForm } from "../../components";
import { FormPage } from "../../components/PageContainer";

const AgregarCita = () => {
  return (
    <FormPage title="Nueva cita" subtitle="Programa una cita con paciente y médico." maxWidth="max-w-4xl">
      <CitaForm />
    </FormPage>
  );
};

export default AgregarCita;
