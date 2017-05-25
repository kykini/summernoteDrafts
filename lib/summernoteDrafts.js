// Generated by CoffeeScript 1.12.5
(function() {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('jquery'));
    } else {
      factory(window.jQuery);
    }
  })(function($) {
    $.extend($.summernote.options, {
      sDrafts: {
        storePrefix: 'sDrafts'
      }
    });
    $.extend($.summernote.lang['en-US'], {
      sDrafts: {
        save: 'Save draft',
        load: 'Load Drafts',
        select: 'select the draft you want to load',
        provideName: 'Provide a name for this draft',
        saved: 'Draft was successfully saved',
        loaded: 'Draft was successfully loaded',
        deleteAll: 'Delete all drafts',
        noDraft: 'The selected draft couldn\'t be loaded, try again or select another one',
        nosavedDrafts: 'There aren\'t any drafts saved',
        deleteDraft: 'delete',
        youSure: 'Are you sure you want to do this?'
      }
    });
    $.extend($.summernote.plugins, {
      'sDraftsSave': function(context) {
        var $editor, lang, options, ui;
        ui = $.summernote.ui;
        options = context.options;
        lang = options.langInfo.sDrafts;
        $editor = context.layoutInfo.editor;
        context.memo('button.sDraftsSave', function() {
          var button;
          button = ui.button({
            contents: lang.save,
            tooltip: lang.save,
            click: function(e) {
              e.preventDefault();
              context.invoke('sDraftsSave.show');
              return false;
            }
          });
          return button.render();
        });
        this.initialize = (function(_this) {
          return function() {
            var $container, body, footer;
            $container = options.dialogsInBody ? $(document.body) : $editor;
            body = "<div class='form-group'><label>" + lang.provideName + "</label><input class='note-draftName form-control' type='text' /></div>";
            footer = "<button href='#' class='btn btn-primary note-link-btn'>" + lang.save + "</button>";
            _this.$dialog = ui.dialog({
              className: 'link-dialog',
              title: lang.save,
              fade: options.dialogsFade,
              body: body,
              footer: footer
            }).render().appendTo($container);
          };
        })(this);
        this.destroy = (function(_this) {
          return function() {
            ui.hideDialog(_this.$dialog);
          };
        })(this);
        this.show = (function(_this) {
          return function() {
            var $saveBtn;
            ui.showDialog(_this.$dialog);
            return $saveBtn = _this.$dialog.find('.note-link-btn').click(function(e) {
              var draftName;
              e.preventDefault;
              draftName = _this.$dialog.find('.note-draftName').val();
              _this.saveDraft(draftName);
              return false;
            });
          };
        })(this);
        this.saveDraft = (function(_this) {
          return function(name) {
            var body, isoDate;
            isoDate = new Date().toISOString();
            if (name == null) {
              name = isoDate;
            }
            name = options.sDrafts.storePrefix + '-' + name;
            body = context.code();
            store.set(name, {
              name: name,
              sDate: isoDate,
              body: body
            });
            alert(lang.saved);
            ui.hideDialog(_this.$dialog);
          };
        })(this);
      }
    });
    return $.extend($.summernote.plugins, {
      'sDraftsLoad': function(context) {
        var $editor, draft, drafts, fn, htmlList, key, lang, options, ui;
        ui = $.summernote.ui;
        options = context.options;
        lang = options.langInfo.sDrafts;
        $editor = context.layoutInfo.editor;
        drafts = [];
        store.each(function(key, value) {
          if (typeof key === 'string' && key.indexOf(options.sDrafts.storePrefix) >= 0) {
            return drafts[key] = value;
          }
        });
        htmlList = '';
        fn = function() {
          return htmlList += "<li class='list-group-item'><a href='#' class='note-draft' data-draft='" + key + "'>" + draft.name + " - <small>" + draft.sDate + "</a></small><a href='#' class='label label-danger pull-right delete-draft' data-draft='" + key + "'>" + lang.deleteDraft + "</a></li>";
        };
        for (key in drafts) {
          draft = drafts[key];
          fn();
        }
        context.memo('button.sDraftsLoad', function() {
          var button;
          button = ui.button({
            contents: lang.load,
            tooltip: lang.load,
            click: function(e) {
              e.preventDefault();
              context.invoke('sDraftsLoad.show');
              return false;
            }
          });
          return button.render();
        });
        this.initialize = (function(_this) {
          return function() {
            var $container, body, footer;
            $container = options.dialogsInBody ? $(document.body) : $editor;
            body = htmlList.length ? "<h4>" + lang.select + "</h4><ul class='list-group'>" + htmlList + "</ul>" : "<h4>" + lang.nosavedDrafts + "</h4>";
            footer = htmlList.length ? "<button href='#' class='btn btn-primary deleteAll'>" + lang.deleteAll + "</button>" : "";
            _this.$dialog = ui.dialog({
              className: 'link-dialog',
              title: lang.load,
              fade: options.dialogsFade,
              body: body
            }, footer = footer).render().appendTo($container);
          };
        })(this);
        this.destroy = (function(_this) {
          return function() {
            ui.hideDialog(_this.$dialog);
          };
        })(this);
        this.show = (function(_this) {
          return function() {
            var $deleteDraft, $selectedDraft;
            ui.showDialog(_this.$dialog);
            $selectedDraft = _this.$dialog.find('.note-draft').click(function(e) {
              var data, div;
              e.preventDefault;
              div = document.createElement('div');
              key = $(this).data('draft');
              data = drafts[key];
              if (data) {
                div.innerHTML = data.body;
                context.invoke('editor.insertNode', div);
                alert(lang.loaded);
                this.destroy;
                this.$dialog.remove();
              } else {
                alert(lang.noDraft);
              }
              return false;
            });
            $deleteDraft = _this.$dialog.find('a.delete-draft').click(function(e) {
              var data, self;
              if (confirm(lang.youSure)) {
                key = $(this).data('draft');
                data = drafts[key];
                if (data) {
                  store.remove(key);
                  self = $(this);
                  return self.parent().hide('slow', function() {
                    $(this).remove();
                  });
                } else {
                  return alert(lang.noDraft);
                }
              }
            });
          };
        })(this);
      }
    });
  });

}).call(this);