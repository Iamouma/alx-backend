#!/usr/bin/env python3
"""
Basic cache
"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """
    Defines basic caching system
    """

    def put(self, key, item):
        """
        Adds an item in the cache
        """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item by key
        """
        if key in self.cache_data:
            return self.cache_data[key]
        return None
