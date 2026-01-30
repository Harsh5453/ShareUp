package com.shareup.item.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shareup.item.model.Item;
import com.shareup.item.model.ItemStatus;

public interface ItemRepository extends MongoRepository<Item, String> {
List<Item> findByStatus(ItemStatus status);
List<Item> findByCategoryAndStatus(String category, ItemStatus status);

List<Item> findByOwnerId(Long ownerId);
}