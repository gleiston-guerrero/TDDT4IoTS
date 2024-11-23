/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package apis;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author tonyp
 */
@javax.ws.rs.ApplicationPath("webapis")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method. It is automatically
     * populated with all resources defined in the project. If required, comment
     * out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(apis.Component_TaskApis.class);
        resources.add(apis.ComponentsApis.class);
        resources.add(apis.Entregable_MembersApis.class);
        resources.add(apis.Entregable_TaskApis.class);
        resources.add(apis.Master_projectApis.class);
        resources.add(apis.PersonApis.class);
        resources.add(apis.Project_EntregableApis.class);
        resources.add(apis.ReporteApi.class);
    }

}
