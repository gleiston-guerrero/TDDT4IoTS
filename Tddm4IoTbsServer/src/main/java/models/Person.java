/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import org.json.JSONObject;
import org.json.XML;

/**
 * This class represents the entity person, which allows you to access the
 * program and identify who owns a series of elements dependent on this entity.
 *
 * @author tonyp
 */
public class Person {

    String id_person = "";
    String name_person = "";
    String lastname_person = "";
    String pathimg_person = "";
    String codeverifitacion_person = "";
    String dateverification_person = "";
    String type_person = "";
    String email_person = "";
    String password_person = "";
    String datereg_person = "";
    String provider_person = "";
    String id_city = "";

    public Person() {
    }

    public String getId_person() {
        return id_person;
    }

    public void setId_person(String id_person) {
        this.id_person = id_person;
    }

    public String getName_person() {
        return name_person;
    }

    public void setName_person(String name_person) {
        this.name_person = name_person;
    }

    public String getLastname_person() {
        return lastname_person;
    }

    public void setLastname_person(String lastname_person) {
        this.lastname_person = lastname_person;
    }

    public String getPathimg_person() {
        return pathimg_person;
    }

    public void setPathimg_person(String pathimg_person) {
        this.pathimg_person = pathimg_person;
    }

    public String getCodeverifitacion_person() {
        return codeverifitacion_person;
    }

    public void setCodeverifitacion_person(String codeverifitacion_person) {
        this.codeverifitacion_person = codeverifitacion_person;
    }

    public String getDateverification_person() {
        return dateverification_person;
    }

    public void setDateverification_person(String dateverification_person) {
        this.dateverification_person = dateverification_person;
    }

    public String getType_person() {
        return type_person;
    }

    public void setType_person(String type_person) {
        this.type_person = type_person;
    }

    public String getEmail_person() {
        return email_person;
    }

    public void setEmail_person(String email_person) {
        this.email_person = email_person;
    }

    public String getPassword_person() {
        return password_person;
    }

    public void setPassword_person(String password_person) {
        this.password_person = password_person;
    }

    public String getDatereg_person() {
        return datereg_person;
    }

    public void setDatereg_person(String datereg_person) {
        this.datereg_person = datereg_person;
    }

    public String getProvider_person() {
        return provider_person;
    }

    public void setProvider_person(String provider_person) {
        this.provider_person = provider_person;
    }

    public String getId_city() {
        return id_city;
    }

    public void setId_city(String id_city) {
        this.id_city = id_city;
    }

    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<person>" + XML.toString(jsonU) + "</person>";
    }
}
