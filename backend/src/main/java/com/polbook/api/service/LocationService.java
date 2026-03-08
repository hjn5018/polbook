package com.polbook.api.service;

import com.polbook.api.dto.LocationResponse;
import com.polbook.api.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationResponse> getActiveLocations() {
        return locationRepository.findAllByIsActiveTrue().stream()
                .map(loc -> LocationResponse.builder()
                        .locationId(loc.getLocationId())
                        .name(loc.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
