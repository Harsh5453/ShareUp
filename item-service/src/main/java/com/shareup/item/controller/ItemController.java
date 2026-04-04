package com.shareup.item.controller;

import com.shareup.item.dto.ItemRequestDTO;
import com.shareup.item.model.Item;
import com.shareup.item.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // OWNER creates item
    @PostMapping
    public Item addItem(@RequestBody ItemRequestDTO dto, Authentication authentication) {

        Long ownerId = Long.parseLong(authentication.getPrincipal().toString());

        return itemService.createItem(ownerId, dto);
    }

    // OWNER uploads image
    @PostMapping("/{id}/image")
    public String uploadImage(@PathVariable String id,
                              @RequestParam MultipartFile image,
                              Authentication authentication) {

        Long ownerId = Long.parseLong(authentication.getPrincipal().toString());

        return itemService.uploadImage(id, image, ownerId);
    }

    // Public browsing (only AVAILABLE items handled in service)
    @GetMapping
    public List<Item> browseItems(@RequestParam(required = false) String category) {
        return itemService.getAvailableItems(category);
    }

    // Public item details
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable String id) {
        return itemService.getItemById(id);
    }

    // Rental-service calls when rental approved
    @PutMapping("/{id}/rented")
    public Item markRented(@PathVariable String id) {
        return itemService.setItemRented(id);
    }

    // Rental-service calls when item returned
    @PutMapping("/{id}/available")
    public Item markAvailable(@PathVariable String id) {
        return itemService.setItemAvailable(id);
    }

    // OWNER inventory
    @GetMapping("/owner")
    public List<Item> getMyItems(Authentication authentication) {

        Long ownerId = Long.parseLong(authentication.getPrincipal().toString());

        return itemService.getItemsByOwner(ownerId);
    }

    // =========================
    // NEW FEATURE: Delete Item
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id,
                                             Authentication authentication) {

        Long ownerId = Long.parseLong(authentication.getPrincipal().toString());

        itemService.deleteItem(id, ownerId);

        return ResponseEntity.ok("Item deleted successfully");
    }

    // =========================
    // OPTIONAL: Generic status update
    // (keeps old endpoints working)
    // =========================
    @PutMapping("/{id}/status")
    public Item updateItemStatus(@PathVariable String id,
                                 @RequestParam String status) {

        if (status.equalsIgnoreCase("RENTED")) {
            return itemService.setItemRented(id);
        }

        if (status.equalsIgnoreCase("AVAILABLE")) {
            return itemService.setItemAvailable(id);
        }

        throw new RuntimeException("Invalid status value");
    }

    // ====== Health Endpoint ==============
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}