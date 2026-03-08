package com.polbook.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${polbook.upload.path:./uploads}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 이미지를 위한 리소스 핸들러 등록
        // local file:///... 경로를 스프링 리소스 경로로 매핑
        String absolutePath = new File(uploadPath).getAbsolutePath();

        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:///" + absolutePath + File.separator);
    }
}
