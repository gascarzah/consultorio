import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  modificarHorario,
  registrarHorario,
  resetState,
} from "../../slices/horarioSlice";
import { LISTAR_HORARIO, SweetCrud, SWEET_GUARDO, SWEET_MODIFICO, SWEET_SUCESS } from "../../utils";
import { VALIDATION_MESSAGES } from "../../utils/ValidationMessages";


const horarioSchema = Yup.object().shape({
  descripcion: Yup.string().required(VALIDATION_MESSAGES.REQUIRED.DESCRIPCION_HORARIO),
});

export const HorarioForm = ({ horario }) => {
  const { user } = useSelector((state) => state.usuario);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values, resetForm) => {
    if (!values.idHorario) {
      
      dispatch(registrarHorario({...values, idEmpresa: user.idEmpresa}))
        .unwrap()
        .then(() => {
          SweetCrud(SWEET_GUARDO, SWEET_SUCESS)
          dispatch(resetState())
          navigate(LISTAR_HORARIO);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo procesar');
          
        });
    } else {
      
      dispatch(modificarHorario(values))
        .unwrap()
        .then(() => {
          SweetCrud(SWEET_MODIFICO, SWEET_SUCESS)
          dispatch(resetState())
          navigate(LISTAR_HORARIO);
        })
        .catch((errores) => {
          SweetCrud('Error', errores.message || 'No se pudo procesar');
          
        });
    }
  };


  return (
    <>
      <Formik
        initialValues={{
          idHorario: horario?.idHorario,
          descripcion: horario?.descripcion,
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
          //resetForm();
        }}
        validationSchema={horarioSchema}
      >
        {({ errors, touched, values, handleChange }) => {
          return (
            <Form className=" my-10 bg-white shadow rounded p-10 flex flex-col w-2/5   ">
              <h1 className="text-sky-500 font-black text-3xl capitalize text-center mb-8">
                {horario?.idHorario ? "Editar Horario" : "Registrar Horario"}
              </h1>
              <div className="my-3">
                <label
                  htmlFor="descripcion"
                  className="uppercase text-gray-600 block font-bold"
                >
                  Descripcion
                </label>
                <Field
                  id="descripcion"
                  type="text"
                  placeholder="Descripcion"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
                  style={{ display: "block" }}
                  name={"descripcion"}
                />
                <ErrorMessage
                  name="descripcion"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="">
                <input
                  type="submit"
                  value="Registrar Horario"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full uppercase"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
      
    </>
  );
};
