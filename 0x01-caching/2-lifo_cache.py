#!/usr/bin/env python3
"""
LIFO caching
"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFO cache system
    """

    def __init__(self):
        """
        Initialize LIFO cache
        """
        super().__init__()
        self.stack = []

    def put(self, key, item):
        """
        Adds an item in the cache
        """
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.stack.remove(key)
            else:
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    discard = self.stack.pop()
                    del self.cache_data[discard]
                    print("DISCARD:", discard)
                self.cache_data[key] = item
            self.stack.append(key)

    def get(self, key):
        """
        Gets an item by key
        """
        if key in self.cache_data:
            return self.cache_data[key]
        return None

