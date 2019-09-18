from scrapy.loader import ItemLoader
from scrapy.loader.processors import Compose


def delete_combine(li: list):

    if '\n' in li[1]:
        return li[0]
    else:
        return li[0] + li[1]


class CourseLoader(ItemLoader):

    name_in = Compose(delete_combine)
