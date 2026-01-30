package com.shareup.item.service;

import com.shareup.item.dto.ItemRequestDTO;
import com.shareup.item.model.Item;
import com.shareup.item.model.ItemStatus;
import com.shareup.item.repository.ItemRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final String uploadDir = "uploads";

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // ---------- CREATE ITEM (OWNER ONLY) ----------
    public Item createItem(Long ownerId, ItemRequestDTO dto) {

        Item item = new Item();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());
        item.setPrice(dto.getPrice());
        item.setOwnerId(ownerId);
        item.setPickupAddress(dto.getPickupAddress());
        item.setStatus(ItemStatus.AVAILABLE);

        return itemRepository.save(item);
    }

    // ---------- UPLOAD IMAGE (OWNER ONLY) ----------
    public String uploadImage(String itemId, MultipartFile file, Long ownerId) {

        try {
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found"));

            // ownership validation
            if (!item.getOwnerId().equals(ownerId)) {
                throw new AccessDeniedException("You are not the owner of this item");
            }

            Files.createDirectories(Paths.get(uploadDir));

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir).resolve(filename);

            Files.write(path, file.getBytes());

            item.setImageUrl(filename);
            itemRepository.save(item);

            return filename;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    // ---------- PUBLIC BROWSE ----------
    public List<Item> getAvailableItems(String category) {

        if (category == null || category.isEmpty()) {
            return itemRepository.findByStatus(ItemStatus.AVAILABLE);
        }

        return itemRepository.findByCategoryAndStatus(category, ItemStatus.AVAILABLE);
    }

    // ---------- RENTAL SYNC ----------
    public Item setItemRented(String itemId) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setStatus(ItemStatus.RENTED);
        return itemRepository.save(item);
    }

    public Item setItemAvailable(String itemId) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setStatus(ItemStatus.AVAILABLE);
        return itemRepository.save(item);
    }

    // ---------- OWNER INVENTORY ----------
    public List<Item> getItemsByOwner(Long ownerId) {
        return itemRepository.findByOwnerId(ownerId);
    }

    public Item getItemById(String id) {

        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

       
        if (item.getStatus() == null) {
            item.setStatus(ItemStatus.AVAILABLE);
            itemRepository.save(item);
        }

        if (item.getOwnerId() == null) {
            throw new RuntimeException("Invalid item data (owner missing)");
        }

        return item;
    }

    
}
