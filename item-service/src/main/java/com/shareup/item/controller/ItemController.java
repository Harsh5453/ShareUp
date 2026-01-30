package com.shareup.item.controller;

import com.shareup.item.dto.ItemRequestDTO;
import com.shareup.item.model.Item;
import com.shareup.item.service.ItemService;
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

    // Public browsing
    @GetMapping
    public List<Item> browseItems(@RequestParam(required = false) String category) {
        return itemService.getAvailableItems(category);
    }
 // Public item details
    @GetMapping("/{id}")
    public Item getItemById(@PathVariable String id) {
        return itemService.getItemById(id);
    }

    // Rental-service calls
    @PutMapping("/{id}/rent")
    public Item markRented(@PathVariable String id) {
        return itemService.setItemRented(id);
    }

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
}
