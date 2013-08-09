Rule Management User Interface
Created By David Lyle for his Altisource Internship
with help from Richard Gu
Started 7/1/2013

Mongo Full Text Search Use
    First enable Text Search. I do this by starting the mongo daemon with the command:
        mongod --setParameter textSearchEnabled=true
        (have to do this every time you start mongo, I think there is a way where you just
         put it in the config file instead)

    Then create a text index using the command
        db.baserules.ensureIndex({ title: "text",
                                   content: "text,
                                   ... //other fields
                                 })

