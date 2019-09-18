class CurriculumSpider:
    name = "curr"

    def __init__(self, sem=None, *args, **kwargs):
        base_url = f'https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem={sem}&clsno='

        self.start_urls = []

        with open('clsno_list.js', 'r', encoding='UTF8') as f:
            for i in f:
                class_numbers = eval(i)

                new_urls = [
                    base_url + class_number for class_number in class_numbers
                ]

                self.start_urls += new_urls


sem = 1081
start_urls = []
base_url = f'https://aisap.nutc.edu.tw/public/day/course_list.aspx?sem={sem}&clsno='

with open('clsno_list.js', 'r', encoding='UTF8') as f:
    for i in f:
        class_numbers = eval(i)

        new_urls = [
            base_url + class_number[0] for class_number in class_numbers
        ]

        start_urls += new_urls
