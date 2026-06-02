package com.gafahtec.consultorio.util;

import com.gafahtec.consultorio.cron.Scheduler;
import com.gafahtec.consultorio.dto.Semana;
import com.gafahtec.consultorio.dto.request.ProgramacionRequest;

import java.text.ParseException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Year;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class GenerarProgramacionFechas {


    public static List<Semana> semanasDelAnio(int anio){
        LocalDate fechaInicio = LocalDate.of(anio, 1, 1);
        LocalDate fechaFin = LocalDate.of(anio, 12, 31);

        return obtenerSemanas(fechaInicio, fechaFin);
    }


    public static List<LocalDate> listaFechas(Date fechaInicial, Date fechaFinal) throws ParseException {
//        Date startDate = DateUtils.parseDate(fechaInicial, new String[] { "yyyy-MM-dd HH:mm:ss", "dd/MM/yyyy" });
//        Date endDate = DateUtils.parseDate(fechaFinal, new String[] { "yyyy-MM-dd HH:mm:ss", "dd/MM/yyyy" }) ;

        LocalDate startLocalDate = fechaInicial.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endLocalDate = fechaFinal.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        return  getDatesRangeJava9(startLocalDate, endLocalDate);


    }

    public static List<LocalDate> getDatesRangeJava9(LocalDate startDate, LocalDate endDate) {
        return startDate.datesUntil(endDate.plusDays(1)).toList();
    }

    public static List<Semana> obtenerSemanas(LocalDate inicio, LocalDate fin) {
        List<Semana> semanas = new ArrayList<>();

        // Asegurarse de que la fecha de inicio es un lunes
        LocalDate lunesInicial = inicio.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        // Asegurarse de que la fecha de fin es un domingo
        LocalDate domingoFinal = fin.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        LocalDate current = lunesInicial;
        while (!current.isAfter(domingoFinal)) {
            LocalDate lunes = current;
            LocalDate domingo = current.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

            semanas.add(new Semana(lunes, domingo));

            current = current.plusWeeks(1);
        }

        return semanas;
    }




    public static int obtenerNumeroSemana(LocalDate fecha) {
        WeekFields weekFields = WeekFields.ISO; // Semanas ISO: empiezan en lunes
        return fecha.get(weekFields.weekOfYear());
    }

}
