#!/usr/bin/env python3
"""
LRU caching
"""


BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """
    LRU cache system
    """

    def __init__(self):
        """
        Initialize LRU cache
        """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """
        Adds an item in the cache
        """
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.queue.remove(key)
            else:
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    discard = self.queue.pop(0)
                    del self.cache_data[discard]
                    print("DISCARD:", discard)
                self.cache_data[key] = item
            self.queue.append(key)

    def get(self, key):
        """
        Gets an item by key
        """
        if key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            return self.cache_data[key]
        return None
