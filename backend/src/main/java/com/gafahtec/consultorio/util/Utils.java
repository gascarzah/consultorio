package com.gafahtec.consultorio.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Utils {
    public static String getFecha2String(Date fecha) {
        String pattern = "dd/MM/yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        String date = simpleDateFormat.format(fecha);
        return date;
    }

    public static Integer[] getTurnos(){

        return  new Integer[]{1,2,3};
    }
    
    public static String[] DIAS = {"Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"};

    
    public static Map<Integer, Boolean> getListaDias() {
        Map<Integer, Boolean> map = new HashMap<>();
        for(int i=0; i<6; i++) {
            map.put(i,false);
        }

        
        return map;
    }
}
